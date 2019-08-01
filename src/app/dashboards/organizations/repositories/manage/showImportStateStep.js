import React from "react";
import {Query} from "react-apollo";
import {vcs_service} from "../../../../services/graphql";
import {Table, Progress} from "antd";
import gql from "graphql-tag";


const SHOW_IMPORT_STATE_QUERY = gql`
    query showImportState($connectorKey:String!, $repositoryKeys: [String]!){
        vcsConnector(key:$connectorKey) {
            id
            repositories(keys:$repositoryKeys, interfaces: [SyncStateSummary]){
                edges {
                    node {
                        id
                        name
                        key
                        importState
                        commitCount
                        commitsInProcess
                    }
                }
            }
        }
    }
`

function getPercentComplete(commitCount, commitsInProcess){
  if (commitCount > 0) {
    if (commitsInProcess != null) {
      return Math.floor(((commitCount - commitsInProcess)/commitCount) * 100)
    } else {
      return null
    }
  } else {
    return null
  }
}

function getCommitsProcessed(commitCount, commitsInProcess){

    if (commitsInProcess != null) {
      return (commitCount - commitsInProcess)
    } else {
      return null
    }

}

export const ShowImportStateStep = (
  {
    selectedConnector,
    importedRepositoryKeys
  }
) => {
  return (
    <Query
      client={vcs_service}
      query={SHOW_IMPORT_STATE_QUERY}
      variables={{
        connectorKey: selectedConnector.key,
        repositoryKeys: importedRepositoryKeys
      }}
      pollInterval={1000}
    >
      {
        ({loading, error, data}) => {
          if (error) return null;
          let repositories = []
          if (!loading) {
            repositories = data.vcsConnector.repositories.edges.map(
              edge => ({
                key: edge.node.key,
                name: edge.node.name,
                importState: edge.node.importState == 'polling for updates' ? 'imported' : edge.node.importState,
                commitCount: edge.node.commitCount,
                commitsProcessed: getCommitsProcessed(edge.node.commitCount, edge.node.commitsInProcess),
                percentComplete: getPercentComplete(edge.node.commitCount, edge.node.commitsInProcess)
              })
            );
          }

          const numImported = repositories.filter(repository => repository.importState === 'imported').length

          return (
            <div className={'show-import-state'}>

              {
                repositories.length > 0 &&
                <Progress type={'circle'} percent={(numImported / repositories.length) * 100}/>
              }
              <Table
                dataSource={repositories}
                loading={loading}
                rowKey={record => record.key}

                pagination={{
                  total: repositories.length,
                  defaultPageSize: 5,
                  hideOnSinglePage: true
                }}
              >
                <Table.Column title={"Repository"} dataIndex={"name"} key={"name"}/>
                <Table.Column title={"Import Status"} dataIndex={"importState"} key={"importState"}/>
                <Table.Column title={"Total Commits"} dataIndex={"commitCount"} key={"commitCount"}/>
                <Table.Column title={"Total Imported"} dataIndex={"commitsProcessed"} key={"commitsProcessed"}/>
                <Table.Column
                  title={""}
                  dataIndex={"percentComplete"}
                  key={"percentComplete"}
                  render={
                    percentComplete => (
                      percentComplete != null &&
                        <Progress
                          percent={
                            percentComplete
                          }
                        />
                    )
                  }
                />
              </Table>
            </div>
          );
        }
      }
    </Query>
  )
}

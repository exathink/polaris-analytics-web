import React from "react";
import {Query, compose} from "react-apollo";
import {vcs_service} from "../../../../services/graphql";
import {Table, Progress} from "antd";
import {withPollingManager} from "../../../../components/graphql/withPollingManager";
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

function getPercentComplete(commitCount, commitsInProcess) {
  if (commitCount > 0) {
    if (commitsInProcess != null) {
      return
    } else {
      return 0
    }
  } else {
    return 0
  }
}


export class ShowImportStateStep extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      repositoryIndex: {},
      numImported: 0
    }
  }

  getImportState(repository) {
    const currentState = this.state.repositoryIndex[repository.key];
    if (currentState != null) {
      if ((currentState.importState === 'importing'  || currentState.importState === 'verifying') && repository.importState == 'import queued') {
        return 'verifying'
      } else {
        return repository.importState === 'polling for updates' ? 'imported' : repository.importState
      }
    } else {
      return repository.importState
    }
  }

  getImportProgress(repository) {
    const {commitCount, commitsInProcess} = repository;
    const currentState = this.state.repositoryIndex[repository.key];
    console.log(`Commits in Process: ${commitsInProcess}`);

    let commitsProcessed = 0;
    if (commitCount != null) {
        commitsProcessed = commitsInProcess != null ?
                            (commitCount - commitsInProcess) :
                              currentState != null ?
                                commitCount :
                                  0;
    }
    const percentComplete = commitCount != null ? Math.ceil((commitsProcessed / commitCount) * 100) : 0;
    console.log(`Percent Complete: ${percentComplete}`);

    return {
      commitsProcessed: currentState != null ? Math.max(currentState.commitsProcessed, commitsProcessed) : commitsProcessed,
      percentComplete: currentState != null ? Math.max(currentState.percentComplete, percentComplete): percentComplete
    }
  }


  onDataUpdated(data) {
    const repositories = data.vcsConnector.repositories.edges.map(
      edge => {
        const repository = edge.node;
        return {
          key: repository.key,
          name: repository.name,
          commitCount: repository.commitCount,
          importState: this.getImportState(repository),
          ...this.getImportProgress(repository)
        }
      }
    )
    this.setState({
      repositoryIndex: repositories.reduce(
        (index, repository) => {
          index[repository.key] = repository;
          return index;
        },
        {}
      ),
      numImported: repositories.filter(repository => repository.importState === 'imported' || repository.importState == 'verifying').length
    })
  }

  render() {
    const {
      selectedConnector,
      importedRepositoryKeys
    } = this.props;

    return (
      <Query
        client={vcs_service}
        query={SHOW_IMPORT_STATE_QUERY}
        variables={{
          connectorKey: selectedConnector.key,
          repositoryKeys: importedRepositoryKeys
        }}
        pollInterval={1000}
        onCompleted={
          data => {
            this.onDataUpdated(data)
          }
        }
      >
        {
          ({loading, error, data}) => {
            if (error) return null;
            const {repositoryIndex, numImported} = this.state;
            const repositories = Object.values(repositoryIndex);
            return (
              <div className={'show-import-state'}>

                {
                  repositories.length > 0 &&
                  <Progress type={'circle'} percent={(numImported / repositories.length) * 100}/>
                }
                <Table
                  dataSource={repositories}
                  loading={repositories.length == 0}
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
}




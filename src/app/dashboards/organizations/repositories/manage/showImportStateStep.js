import React from "react";
import {Query, compose} from "react-apollo";
import {vcs_service} from "../../../../services/graphql";
import {Table, Progress, Spin} from "antd";
import {withPollingManager} from "../../../../components/graphql/withPollingManager";
import gql from "graphql-tag";

const stateSortOrder = {
  'importing': 0,
  'verifying': 1,
  'imported': 2,
  'import queued': 3
}

const stateClassIndex = {
  'import queued': 'import-queued',
  'importing': 'import-in-process',
  'verifying': 'import-in-process',
  'imported': 'import-complete'
}

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
      stateIndex: {},
    }
  }

  getImportState(repository) {
    const currentState = this.state.repositoryIndex[repository.key];
    if (currentState != null) {
      if ((currentState.importState === 'importing' || currentState.importState === 'verifying') && repository.importState == 'import queued') {
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
    const percentComplete = (commitCount != null && commitCount > 0) ? Math.ceil((commitsProcessed / commitCount) * 100) : 0;
    console.log(`Percent Complete: ${percentComplete}`);

    return {
      commitsProcessed: currentState != null ? Math.max(currentState.commitsProcessed, commitsProcessed) : commitsProcessed,
      percentComplete: currentState != null ? Math.max(currentState.percentComplete, percentComplete) : percentComplete
    }
  }


  groupByState(repositories) {
    return
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
      stateIndex: repositories.reduce(
        (index, repository) => {
          index[repository.importState] = (index[repository.importState] || 0) + 1;
          return index;
        },
        {}
      )
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
            const {repositoryIndex, stateIndex} = this.state;
            const numImported = stateIndex['imported'] || 0 + stateIndex['verifying'] || 0;
            const numQueued = stateIndex['import queued'] || 0;
            // Sort the list so the active ones stay at the top and the queued ones are at the bottom
            const repositories = Object.values(repositoryIndex).sort(
              (a, b) => stateSortOrder[a.importState] - stateSortOrder[b.importState]
            );
            return (
              <div className={'show-import-state'}>

                {
                  repositories.length > 0 &&
                    numQueued == repositories.length ?
                      <Spin size={"large"} tip={`${repositories.length} imports queued`}/>
                    :
                      <Progress type={'circle'} percent={Math.ceil((numImported / repositories.length) * 100)}/>
                }
                <Table
                  dataSource={repositories}
                  loading={repositories.length == 0}
                  rowKey={record => record.key}
                  rowClassName={
                    (record, index) => stateClassIndex[record.importState]
                  }
                  pagination={{
                    total: repositories.length,
                    defaultPageSize: 5,
                    hideOnSinglePage: true
                  }}
                >
                  <Table.Column title={"Repository"} dataIndex={"name"} key={"name"}/>
                  <Table.Column title={"Import Status"} dataIndex={"importState"} key={"importState"}/>
                  <Table.Column title={"Commits Imported"} dataIndex={"commitCount"} key={"commitCount"}/>
                  <Table.Column title={"Commits Analyzed"} dataIndex={"commitsProcessed"} key={"commitsProcessed"}/>
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




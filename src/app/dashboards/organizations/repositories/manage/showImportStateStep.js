import {gql} from "@apollo/client";
import {Query} from "@apollo/client/react/components"
import React from "react";
import {Progress, Spin} from "antd";

import {vcs_service} from "../../../../services/graphql";
import {CompactTable} from "../../../../components/tables";
import styles from "./addRepositoryWorkflow.module.css";

const {Column} = CompactTable;

const stateSortOrder = {
  'importing': 0,
  'queued': 2,
  'failed': 1,
  'imported': 3,

}

const stateClassIndex = {
  'queued': 'import-queued',
  'importing': 'import-in-process',
  'imported': 'import-complete',
  'failed': 'import-failed'
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


export class ShowImportStateStep extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      repositoryIndex: {},
      stateIndex: {},
    }
  }

  getDisplayedImportState(repository) {
    const {importState, commitCount} = repository;
    const percentComplete = this.getPercentComplete(repository);



    const displayedImportState =
      (percentComplete === 100) ? 'imported' :
        (importState === 'polling') ? 'imported' :
          (importState === 'import-failed') ? 'failed' :
            (importState === 'import-ready' && (commitCount === null || commitCount === 0)) ? 'queued' :
              (importState === 'import-queued' && (commitCount === 0 || commitCount === 0)) ? 'queued' :
                (importState === 'import-queued' && commitCount > 0) ? 'importing' :
                  (importState === 'import-ready' && commitCount > 0 && percentComplete < 100) ? 'importing' :
                      null

    if (displayedImportState === null ) {
      console.log(`Cannot display import state: S: ${importState} C: ${commitCount}`)
    }
    return displayedImportState
  }

  getCommitsProcessed(repository) {
    const {commitCount, commitsInProcess} = repository;
    return (commitCount || 0) - (commitsInProcess || 0);
  }

  getPercentComplete(repository) {
    const {commitCount} = repository;
    return (commitCount != null && commitCount > 0) ? Math.ceil((this.getCommitsProcessed(repository) / commitCount) * 100) : 0;

  }

  getImportProgress(repository) {
    const currentState = this.state.repositoryIndex[repository.key];

    const commitsProcessed = this.getCommitsProcessed(repository);
    const percentComplete = this.getPercentComplete(repository)
    return {
      commitsProcessed: currentState != null ? Math.max(currentState.commitsProcessed, commitsProcessed) : commitsProcessed,
      percentComplete: currentState != null ? Math.max(currentState.percentComplete, percentComplete) : percentComplete
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
          importState: this.getDisplayedImportState(repository),
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
        notifyOnNetworkStatusChange={true}
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
            const numImported = stateIndex['imported'] || 0;
            const numQueued = stateIndex['queued'] || 0;
            // Sort the list so the active ones stay at the top and the queued ones are at the bottom
            const repositories = Object.values(repositoryIndex).sort(
              (a, b) => stateSortOrder[a.importState] - stateSortOrder[b.importState]
            );
            return (
              <div className={styles['show-import-state']}>
                <div style={{display: "flex", justifyContent: "center", marginBottom: "2rem"}}>
                  {
                    repositories.length > 0 &&
                    numQueued === repositories.length ?
                      <Spin size={"large"} tip={`Allocating server capacity to import ${repositories.length} ${repositories.length > 1 ? 'repositories' : 'repository'}. This may take a minute or two...`}/>
                      :
                      <Progress
                        type={'circle'}
                        percent={Math.ceil((numImported / repositories.length) * 100)}
                        width={80}
                        format={
                          () => `${numImported}/${repositories.length}`
                        }
                      />
                  }
                </div>
                <CompactTable
                  size="small"
                  dataSource={repositories}
                  loading={repositories.length === 0}
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
                  <Column title={"Repository"} width="30%" dataIndex={"name"} key={"name"}/>
                  <Column title={"Import Status"} dataIndex={"importState"} key={"importState"}/>
                  <Column title={"Commits Imported"} dataIndex={"commitCount"} key={"commitCount"}/>
                  <Column title={"Commits Analyzed: Latest 6 Months Only"} dataIndex={"commitsProcessed"} key={"commitsProcessed"}/>
                  <Column
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
                </CompactTable>
              </div>
            );
          }
        }
      </Query>
    )
  }
}

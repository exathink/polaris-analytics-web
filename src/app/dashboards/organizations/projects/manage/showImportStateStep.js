import {gql} from "@apollo/client";
import {Query} from "@apollo/client/react/components"
import React from 'react';

import {Spin, Progress} from "antd";
import {work_tracking_service} from "../../../../services/graphql/index";
import {CompactTable} from "../../../../components/tables";
import {Loading} from "../../../../components/graphql/loading";
import {getConnectorTypeProjectName} from "../../../../components/workflow/connectors/utility";
import {CompletedCheckIcon} from "../../../../components/misc/customIcons";
import styles from "./showImportStateStep.module.css";

const {Column} = CompactTable;
const importStateDisplayMap = {
  ready: 'queued',
  importing: 'importing',
  auto_update: 'complete'
}

const importStateSortOrder = {
  queued: 2,
  complete: 1,
  importing: 0
}

const importStateClassIndex = {
  queued: 'status-queued',
  importing: 'status-importing',
  complete: 'status-complete'
}

const SHOW_IMPORT_STATE_QUERY = gql`
    query showImportState($connectorKey:String!, $projectKeys: [String]!){
        workTrackingConnector(key:$connectorKey) {
            id
            workItemsSources(projectKeys:$projectKeys, interfaces: [WorkItemCount]){
                edges {
                    node {
                        id
                        name
                        key
                        initialImportDays
                        importState
                        workItemCount
                    }
                }
            }
        }
    }
`
export const ShowImportStateStep = (
  {
    selectedConnector,
    importedProjectKeys,
    importedWorkItemsSourcesKeys
  }
) => {
  const {connectorType} = selectedConnector;
  return (
    <Query
      client={work_tracking_service}
      query={SHOW_IMPORT_STATE_QUERY}
      variables={{
        connectorKey: selectedConnector.key,
        projectKeys: importedProjectKeys
      }}
      pollInterval={1000}
    >
      {
        ({loading, error, data}) => {
          if (loading) return <Loading/>;
          if (error) return null;
          let workItemsSources = []

          workItemsSources = data.workTrackingConnector.workItemsSources.edges.map(
            edge => ({
              key: edge.node.key,
              name: edge.node.name,
              importDays: edge.node.initialImportDays,
              importState: importStateDisplayMap[edge.node.importState],
              workItemCount: edge.node.workItemCount
            })
          ).filter(
            /* Filter out the work items sources from the source projects that were not
            * actually imported in this round. This is needed because we will get back
            * all the work items sources in the project from the above query and when we
            * are importing into an existing project it will include previously imported
            * sources as well. */
            workItemsSource => importedWorkItemsSourcesKeys.indexOf(workItemsSource.key) >= 0
          ).sort(
            (a, b) =>
              importStateSortOrder[a.importState] - importStateSortOrder[b.importState]
          );

          debugger;
          const numImported = workItemsSources.filter(
            source => source.importState === 'complete'
          ).length

          return (
            workItemsSources.length > 0 ? (
              <div className={styles['show-import-state']}>
                <div style={{display: "flex", justifyContent: "center", marginBottom: "1rem"}}>
                  <Progress
                    type={'circle'}
                    percent={Math.ceil((numImported / workItemsSources.length) * 100)}
                    width={80}
                    format={
                      () => `${numImported}/${workItemsSources.length}`
                    }
                    data-testid="progress-circle"
                  />
                </div>
                <CompactTable
                  size="small"
                  dataSource={workItemsSources}
                  loading={loading}
                  rowKey={record => record.key}
                  rowClassName={
                    (record, index) => importStateClassIndex[record.importState]
                  }
                  pagination={{
                    total: workItemsSources.length,
                    defaultPageSize: 5,
                    hideOnSinglePage: true
                  }}
                >
                  <Column title={`Remote ${getConnectorTypeProjectName(connectorType)}`} dataIndex={"name"} key={"name"}/>
                  <Column title={"Import Days"} dataIndex={"importDays"} key={"importDays"}/>
                  <Column title={"CardsImported"} dataIndex={"workItemCount"} key={"workItemCount"}/>
                  <Column
                    title={"Import Status"}
                    dataIndex={"importState"}
                    key={"importState"}
                    align={"right"}
                    render={
                      importState =>
                        importState !== 'complete' ?
                          <Spin tip={importState}/>
                          :
                          <CompletedCheckIcon data-testid="completed-check-icon"/>
                    }
                  />
                </CompactTable>
              </div>
            )
              :
              <Loading/>
          );
        }
      }
    </Query>
  )
}
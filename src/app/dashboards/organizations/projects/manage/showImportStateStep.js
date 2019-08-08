import React from 'react';

import {Query} from "react-apollo";
import {work_tracking_service} from "../../../../services/graphql/index";
import gql from "graphql-tag";

import {withSubmissionCache} from "../../../../components/forms/withSubmissionCache";

import {Col, Form, Input, Row, Table, Spin, Progress} from "antd";
import {createForm} from "../../../../components/forms/createForm";
import {NoData} from "../../../../components/misc/noData";

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
    importedProjectKeys
  }
) => {
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
          if (error) return null;
          let workItemsSources = []
          if (!loading) {
            workItemsSources = data.workTrackingConnector.workItemsSources.edges.map(
              edge => ({
                key: edge.node.key,
                name: edge.node.name,
                importDays: edge.node.initialImportDays,
                importState: importStateDisplayMap[edge.node.importState],
                workItemCount: edge.node.workItemCount
              })
            ).sort(
              (a, b) =>
                importStateSortOrder[a] - importStateSortOrder[b]
            );
          }
          const numImported = workItemsSources.filter(
            source => source.importState === 'complete'
          ).length

          return (
            <div className={'show-import-state'}>
              <Progress
                type={'circle'}
                percent={Math.ceil((numImported / workItemsSources.length) * 100)}
                format={
                  () => `${numImported}/${workItemsSources.length}`
                }
              />
              <Table
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
                <Table.Column title={"Remote Project"} dataIndex={"name"} key={"name"}/>
                <Table.Column title={"Import Days"} dataIndex={"importDays"} key={"importDays"}/>
                <Table.Column title={"Work Items Imported"} dataIndex={"workItemCount"} key={"workItemCount"}/>
                <Table.Column
                  title={"Import Status"}
                  dataIndex={"importState"}
                  key={"importState"}
                  render={
                    importState =>
                      importState !== 'complete' ?
                        <Spin tip={importState}/>
                        :
                        <Progress
                          type='circle'
                          width={30}
                          percent={100}
                        />
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
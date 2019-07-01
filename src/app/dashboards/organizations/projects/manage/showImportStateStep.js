import React from 'react';

import {compose, Query} from "react-apollo";
import {work_tracking_service} from "../../../../services/graphql/index";
import gql from "graphql-tag";
import {withSubmissionCache} from "../../../../components/forms/withSubmissionCache";

import {Col, Form, Input, Row, Table} from "antd";
import {createForm} from "../../../../components/forms/createForm";
import {NoData} from "../../../../components/misc/noData";


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
                  importState: edge.node.importState !== 'auto_update' ? 'Importing' : 'Complete',
                  workItemCount: edge.node.workItemCount
                })
              );
            }
            return (
              <div className={'show-import-state'}>
                  <Table
                    dataSource={workItemsSources}
                    loading={loading}
                    rowKey={record => record.key}

                    pagination={{
                      total: workItemsSources.length,
                      defaultPageSize: 5,
                      hideOnSinglePage: true
                    }}
                  >
                    <Table.Column title={"Remote Project"} dataIndex={"name"} key={"name"}/>
                    <Table.Column title={"Import Days"} dataIndex={"importDays"} key={"importDays"}/>
                    <Table.Column title={"Work Items Imported"} dataIndex={"workItemCount"} key={"workItemCount"}/>
                    <Table.Column title={"Import Status"} dataIndex={"importState"} key={"importState"}/>
                  </Table>
              </div>
            );
        }
      }
    </Query>
)}
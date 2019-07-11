import React from 'react';

import {withViewerContext} from "../../../../framework/viewer/viewerContext";
import {compose, Query} from "react-apollo";
import {work_tracking_service} from "../../../../services/graphql/index";
import gql from "graphql-tag";
import {withSubmissionCache} from "../../../../components/forms/withSubmissionCache";
import Button from "../../../../../components/uielements/button";
import {withMutation} from "../../../../components/graphql/withMutation";
import {TrackingReceiptMonitor} from "../../../../components/graphql/trackingReceiptMonitor";

import {Col, Form, Input, Row, Table} from "antd";
import {createForm} from "../../../../components/forms/createForm";


import {NoData} from "../../../../components/misc/noData";



const REFETCH_PROJECTS_MUTATION = {
  name: 'refetchProjects',
  mutation: gql`
      mutation refreshConnectorProjects($connectorKey: String!) {
          refreshConnectorProjects(refreshConnectorProjectsInput:{
              connectorKey: $connectorKey
              track: true
          }){
              success
              trackingReceiptKey
          }
      }
  `,
  client: work_tracking_service,
  getTrackingReceipt: (result) => result.data ? result.data.refreshConnectorProjects.trackingReceiptKey : null
}

export const CONNECTOR_WORK_ITEMS_SOURCES_QUERY = gql`
    query getConnectorWorkItemsSources($connectorKey: String!) {
        workTrackingConnector(key: $connectorKey) {
            id
            name
            key
            connectorType
            state
            workItemsSources(unattachedOnly: true) {
                count
                edges {
                    node {
                        id
                        name
                        key
                        description
                        importState
                    }
                }
            }
        }
    }
`

export const REFETCH_CONNECTOR_WORK_ITEMS_SOURCES_QUERY = {
  query: CONNECTOR_WORK_ITEMS_SOURCES_QUERY,
  mapPropsToVariables: props => ({
    connectorKey: props.selectedConnector.key
  })
};


export const SelectProjectsStep =
  compose(
    withMutation(REFETCH_PROJECTS_MUTATION, [REFETCH_CONNECTOR_WORK_ITEMS_SOURCES_QUERY])
  )(
    class _SelectProjectsStep extends React.Component {
      render() {
        const {selectedConnector, selectedProjects, onProjectsSelected, trackingReceiptCompleted} = this.props;
        const {refetchProjects, refetchProjectsResult} = this.props.refetchProjectsMutation;

        return (
          <Query
            client={work_tracking_service}
            query={CONNECTOR_WORK_ITEMS_SOURCES_QUERY}
            variables={{
              connectorKey: selectedConnector.key
            }}
          >
            {
              ({loading, error, data}) => {
                if (error) return null;
                let workItemsSources = []
                if (!loading) {
                  workItemsSources = data.workTrackingConnector.workItemsSources.edges.map(edge => edge.node);
                }
                return (
                  <div className={'select-projects'}>
                    <h3>Server: {selectedConnector.baseUrl}</h3>
                    <Button
                      type={'primary'}
                      icon={'cloud-sync'}
                      onClick={
                        () => refetchProjects({
                          variables: {
                            connectorKey: selectedConnector.key
                          }
                        })}
                      loading={refetchProjectsResult.data && !trackingReceiptCompleted}
                    >
                      Sync
                    </Button>
                    {
                      workItemsSources.length > 0 ?
                        <React.Fragment>

                          <Table
                            dataSource={workItemsSources}
                            loading={loading}
                            rowKey={record => record.key}
                            rowSelection={{
                              selectedRowKeys: selectedProjects.map(project => project.key),
                              onChange: (selectedKeys, selectedRows) => onProjectsSelected(selectedRows),
                            }}
                            pagination={{
                              total: workItemsSources.length,
                              showTotal: total => `${total} Projects`,
                              defaultPageSize: 5,
                              hideOnSinglePage: true
                            }}
                          >
                            <Table.Column title={"Name"} dataIndex={"name"} key={"name"}/>
                            <Table.Column title={"Description"} dataIndex={"description"} key={"description"}/>
                          </Table>
                        </React.Fragment>
                        :
                        <NoData message={"No projects imported"}/>
                    }
                  </div>

                )
              }
            }
          </Query>

        )
      }
    }
  )





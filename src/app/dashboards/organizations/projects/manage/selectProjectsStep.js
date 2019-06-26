import React from 'react';

import {withViewerContext} from "../../../../framework/viewer/viewerContext";
import {compose, Query} from "react-apollo";
import {work_tracking_service} from "../../../../services/graphql/index";
import gql from "graphql-tag";
import {withSubmissionCache} from "../../../../components/forms/withSubmissionCache";

import {Col, Form, Input, Row, Table} from "antd";
import {createForm} from "../../../../components/forms/createForm";


const CONNECTOR_WORK_ITEMS_SOURCES_QUERY = gql`
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

export class SelectProjectsStep extends React.Component {

  render() {
    const {selectedConnector, selectedProjects, onProjectsSelected} = this.props;

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
                <span>{workItemsSources.length} projects available to import</span>
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
                    defaultPageSize: 5,
                    hideOnSinglePage: true
                  }}
                >
                  <Table.Column title={"Name"} dataIndex={"name"} key={"name"}/>
                  <Table.Column title={"Description"} dataIndex={"description"} key={"description"}/>
                </Table>
              </div>
            )
          }
        }
      </Query>

    )
  }
}





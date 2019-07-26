import React from 'react';
import {compose, Query} from "react-apollo";
import gql from "graphql-tag";
import {Table} from "antd";
import {work_tracking_service} from "../../../../services/graphql/index";
import Button from "../../../../../components/uielements/button";
import {withMutation} from "../../../../components/graphql/withMutation";
import {NoData} from "../../../../components/misc/noData";

function getServerUrl(selectedConnector) {
  switch (selectedConnector.connectorType) {
    case 'pivotal':
      return 'Pivotal Tracker.com';
    case 'github':
      return 'GitHub.com';
    default:
      return selectedConnector.baseUrl;
  }
}

const REFETCH_REPOSITORIES_MUTATION = {
  name: 'refetchRepositories',
  mutation: gql`
      mutation refreshConnectorRepositories($connectorKey: String!) {
          refreshConnectorRepositories(refreshConnectorRepositoriesInput:{
              connectorKey: $connectorKey
              track: true
          }){
              success
              trackingReceiptKey
          }
      }
  `,
  client: work_tracking_service,
  getTrackingReceipt: (result) => result.data ? result.data.refreshConnectorRepositories.trackingReceiptKey : null
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


export const SelectRepositoriesStep =
  compose(
    withMutation(REFETCH_REPOSITORIES_MUTATION, [REFETCH_CONNECTOR_WORK_ITEMS_SOURCES_QUERY])
  )(
    class _SelectRepositoriesStep extends React.Component {
      render() {
        const {selectedConnector, selectedRepositories, onRepositoriesSelected, trackingReceiptCompleted} = this.props;
        const {refetchRepositories, refetchRepositoriesResult} = this.props.refetchRepositoriesMutation;

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
                  <div className={'select-repositories'}>
                    <h3>Server: {getServerUrl(selectedConnector)}</h3>
                    <Button
                      type={'primary'}
                      icon={'download'}
                      onClick={
                        () => refetchRepositories({
                          variables: {
                            connectorKey: selectedConnector.key
                          }
                        })}
                      loading={refetchRepositoriesResult.data && !trackingReceiptCompleted}
                    >
                      Fetch Repositories
                    </Button>
                    {
                      workItemsSources.length > 0 ?
                        <React.Fragment>

                          <Table
                            dataSource={workItemsSources}
                            loading={loading}
                            rowKey={record => record.key}
                            rowSelection={{
                              selectedRowKeys: selectedRepositories.map(project => project.key),
                              onChange: (selectedKeys, selectedRows) => onRepositoriesSelected(selectedRows),
                            }}
                            pagination={{
                              total: workItemsSources.length,
                              showTotal: total => `${total} Repositories`,
                              defaultPageSize: 5,
                              hideOnSinglePage: true
                            }}
                          >
                            <Table.Column title={"Remote Repository Name"} dataIndex={"name"} key={"name"}/>
                            <Table.Column title={"Description"} dataIndex={"description"} key={"description"}/>
                          </Table>
                        </React.Fragment>
                        :
                        <NoData message={"No repositories imported"}/>
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





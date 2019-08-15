import React from 'react';
import gql from "graphql-tag";

import Button from "../../../../../components/uielements/button";
import {compose, Query} from "react-apollo";
import {vcs_service} from "../../../../services/graphql";
import {withMutation} from "../../../../components/graphql/withMutation";
import {withSearch} from "../../../../components/antHelpers/withSearch";
import {CompactTable} from "../../../../components/tables";
import {NoData} from "../../../../components/misc/noData";

const Column = CompactTable;

function getServerUrl(selectedConnector) {
  return selectedConnector.baseUrl;
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
  client: vcs_service,
  getTrackingReceipt: (result) => result.data ? result.data.refreshConnectorRepositories.trackingReceiptKey : null
}

export const CONNECTOR_REPOSITORIES_QUERY = gql`
    query getConnectorWorkItemsSources($connectorKey: String!) {
      vcsConnector(key: $connectorKey) {
            id
            name
            key
            connectorType
            state
            repositories(unimportedOnly: true) {
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

export const REFETCH_CONNECTOR_REPOSITORIES_QUERY = {
  query: CONNECTOR_REPOSITORIES_QUERY,
  mapPropsToVariables: props => ({
    connectorKey: props.selectedConnector.key
  })
};

export const SelectRepositoriesStep = (
  compose(
    withMutation(REFETCH_REPOSITORIES_MUTATION, [REFETCH_CONNECTOR_REPOSITORIES_QUERY]),
    withSearch()
  )(
    class _SelectRepositoriesStep extends React.Component {
      render() {
        const {selectedConnector, selectedRepositories, onRepositoriesSelected, trackingReceiptCompleted, getColumnSearchProps} = this.props;
        const {refetchRepositories, refetchRepositoriesResult} = this.props.refetchRepositoriesMutation;

        return (
          <Query
            client={vcs_service}
            query={CONNECTOR_REPOSITORIES_QUERY}
            variables={{
              connectorKey: selectedConnector.key
            }}
          >
            {
              ({loading, error, data}) => {
                if (error) return null;
                let repositories = []
                if (!loading) {
                  repositories = data.vcsConnector.repositories.edges.map(edge => edge.node);
                }
                return (
                  <div className={'selected-repositories'}>
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
                      repositories.length > 0 ?
                        <CompactTable
                          dataSource={repositories}
                          loading={loading}
                          rowKey={record => record.key}
                          rowSelection={{
                            selectedRowKeys: selectedRepositories.map(repository => repository.key),
                            onChange: (selectedKeys, selectedRows) => onRepositoriesSelected(selectedRows),
                          }}
                          pagination={{
                            showTotal: total => `${total} Repositories`,
                            defaultPageSize: 10,
                            hideOnSinglePage: true
                          }}
                        >
                          <Column
                            title='Repository Name'
                            dataIndex='name'
                            key='name'
                            width='30%'
                            sorter={(a, b) => a.name.localeCompare(b.name)}
                            sortDirections={['ascend']}
                            {...getColumnSearchProps('name')}
                          />
                          <Column
                            title='Description'
                            dataIndex='description'
                            key='description'
                          />
                        </CompactTable>
                        :
                        <NoData message={"No repositories imported"} />
                    }
                  </div>

                )
              }
            }
          </Query>

        )
      }
    }
  ))

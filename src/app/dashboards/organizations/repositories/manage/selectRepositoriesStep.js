import React from 'react';
import gql from "graphql-tag";

import Button from "../../../../../components/uielements/button";
import {ButtonBar, ButtonBarColumn} from "../../../../containers/buttonBar/buttonBar";
import {compose, Query} from "react-apollo";
import {vcs_service} from "../../../../services/graphql";
import {withMutation} from "../../../../components/graphql/withMutation";
import {TEST_CONNECTOR} from "../../../../components/workflow/connectors/mutations";
import {Table} from "../../../../components/tables";
import {useSearch, useSelectionHandler} from "../../../../components/tables/hooks";
import {NoData} from "../../../../components/misc/noData";
import {lexicographic} from "../../../../helpers/utility";
import {EditConnectorFormButton} from "../../../../components/workflow/connectors/editConnectorFormButton";
import {getConnectorTypeDisplayName} from "../../../../components/workflow/connectors/utility";
import {withSubmissionCache} from "../../../../components/forms/withSubmissionCache";
import {EDIT_CONNECTOR} from "../../../../components/workflow/connectors/mutations";

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

const SelectRepositoriesTable = ({loading, dataSource, selectedRepositories, onRepositoriesSelected}) => {
  const {Column} = Table;


  return (
    <Table
      size="small"
      dataSource={dataSource}
      loading={loading}
      rowKey={record => record.key}
      pagination={{
        showTotal: total => `${total} Repositories`,
        defaultPageSize: 10,
        hideOnSinglePage: true
      }}
      rowSelection={useSelectionHandler(onRepositoriesSelected, selectedRepositories)}
    >
      <Column
        title={'Repository'}
        dataIndex={'name'}
        key={'name'}
        sorter={lexicographic('name')}
        sortDirection={'ascend'}
        width={"30%"}
        {...useSearch('name')}
      />
      <Column
        title={'Description'}
        dataIndex={'description'}
        key={'description'}
        {...useSearch('description')}
      />
    </Table>
  )
}

export const SelectRepositoriesStep =
  compose(
    withSubmissionCache,
    withMutation(REFETCH_REPOSITORIES_MUTATION, [REFETCH_CONNECTOR_REPOSITORIES_QUERY]),
    withMutation(TEST_CONNECTOR),
    withMutation(EDIT_CONNECTOR, [REFETCH_CONNECTOR_REPOSITORIES_QUERY])
  )(
    class _SelectRepositoriesStep extends React.Component {
      render() {
        const {selectedConnector, selectedRepositories, onRepositoriesSelected, trackingReceiptCompleted, refetchRepositoriesMutation, testConnectorMutation, getActiveImports, submissionCache, editConnectorMutation} = this.props;
        const {refetchRepositories, refetchRepositoriesResult} = refetchRepositoriesMutation;
        const {submit, lastSubmission} = submissionCache;

        const {testConnector} = testConnectorMutation;
        const {editConnector, editConnectorResult} = editConnectorMutation;

        const {connectorType} = selectedConnector;

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
                    <ButtonBar>
                      <ButtonBarColumn span={8} alignButton={'left'}></ButtonBarColumn>
                      <ButtonBarColumn span={8} alignButton={'center'}>
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
                      </ButtonBarColumn>
                      <ButtonBarColumn span={8} alignButton={'right'}>
                        <Button
                          type={'primary'}
                          icon={'check'}
                          size={'small'}
                          disabled={selectedConnector.state !== 'enabled'}
                          onClick={
                            () => testConnector({
                              variables: {
                                testConnectorInput: {
                                  connectorKey: selectedConnector.key
                                }
                              }
                            })}
                        >
                          {'Test Connector'}
                        </Button>
                        <EditConnectorFormButton
                          connector={selectedConnector}
                          title={`Edit ${getConnectorTypeDisplayName(connectorType)} Connector`}
                          onSubmit={
                            submit(
                              values =>
                                editConnector({
                                  variables: {
                                    editConnectorInput: {
                                      name: values.name,
                                      connectorType: connectorType,
                                      apiKey: values.apiKey,
                                      githubAccessToken: values.githubAccessToken
                                    }
                                  }
                                })
                            )
                          }
                          error={editConnectorResult.error}
                          lastSubmission={lastSubmission}
                        />
                        <Button
                          type={'primary'}
                          icon={'import'}
                          size={'small'}
                          disabled={selectedRepositories.length}
                          onClick={getActiveImports}
                        >
                          {'Active Imports'}
                        </Button>
                      </ButtonBarColumn>
                    </ButtonBar>
                    {
                      repositories.length > 0 ?
                        <SelectRepositoriesTable
                          loading={loading}
                          dataSource={repositories}
                          selectedRepositories={selectedRepositories}
                          onRepositoriesSelected={onRepositoriesSelected}
                        />
                        :
                        <NoData message={"No new repositories to import"} />
                    }
                  </div>

                )
              }
            }
          </Query>

        )
      }
    }
  );

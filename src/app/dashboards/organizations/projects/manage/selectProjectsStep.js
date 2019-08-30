import React from 'react';
import {compose, Query} from "react-apollo";
import gql from "graphql-tag";

import {work_tracking_service} from "../../../../services/graphql";
import Button from "../../../../../components/uielements/button";
import {ButtonBar, ButtonBarColumn} from "../../../../containers/buttonBar/buttonBar";
import {withMutation} from "../../../../components/graphql/withMutation";
import {TEST_CONNECTOR} from "../../../../components/workflow/connectors/mutations";
import {Table} from "../../../../components/tables";
import {useSearch, useSelectionHandler} from "../../../../components/tables/hooks";
import {NoData} from "../../../../components/misc/noData";
import {lexicographic, capitalizeFirstLetter} from "../../../../helpers/utility";
import {EditConnectorFormButton} from "../../../../components/workflow/connectors/editConnectorFormButton";
import {getConnectorTypeDisplayName} from "../../../../components/workflow/connectors/utility";
import {withSubmissionCache} from "../../../../components/forms/withSubmissionCache";
import {EDIT_CONNECTOR} from "../../../../components/workflow/connectors/mutations";

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

function getFetchProjectsButtonName(selectedConnector) {
  switch (selectedConnector.connectorType) {
    case 'github':
      return 'Fetch Repositories with Issues';
    case 'pivotal':
      return 'Fetch Tracker Projects';
    case 'jira':
      return 'Fetch Jira Projects';
    default:
      return 'Fetch Projects';
  }
}

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

const SelectProjectsTable = ({loading, dataSource, selectedProjects, onProjectsSelected}) => {
  const {Column} = Table;


  return (
    <Table
      size="small"
      dataSource={dataSource}
      loading={loading}
      rowKey={record => record.key}
      pagination={{
        showTotal: total => `${total} Projects`,
        defaultPageSize: 10,
        hideOnSinglePage: true
      }}
      rowSelection={useSelectionHandler(onProjectsSelected, selectedProjects)}
    >
      <Column
        title={'Remote Project Name'}
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

export const SelectProjectsStep =
  compose(
    withSubmissionCache,
    withMutation(REFETCH_PROJECTS_MUTATION, [REFETCH_CONNECTOR_WORK_ITEMS_SOURCES_QUERY]),
    withMutation(TEST_CONNECTOR),
    withMutation(EDIT_CONNECTOR, [REFETCH_CONNECTOR_WORK_ITEMS_SOURCES_QUERY])
  )(
    class _SelectProjectsStep extends React.Component {
      render() {
        const {selectedConnectorType, selectedConnector, selectedProjects, onProjectsSelected, trackingReceiptCompleted, refetchProjectsMutation, testConnectorMutation, submissionCache, editConnectorMutation} = this.props;
        const {refetchProjects, refetchProjectsResult} = refetchProjectsMutation;
        const {submit, lastSubmission} = submissionCache;

        const {testConnector} = testConnectorMutation;
        const {editConnector, editConnectorResult} = editConnectorMutation;

        const {connectorType} = selectedConnector;

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
                  <div className={'selected-projects'}>
                    <h3>{capitalizeFirstLetter(selectedConnector.name)} @ {getServerUrl(selectedConnector)}</h3>

                    <ButtonBar>
                      <ButtonBarColumn span={8} alignButton={'left'}></ButtonBarColumn>
                      <ButtonBarColumn span={8} alignButton={'center'}>
                        <Button
                          type={'primary'}
                          icon={'download'}
                          onClick={
                            () => refetchProjects({
                              variables: {
                                connectorKey: selectedConnector.key
                              }
                            })}
                          loading={refetchProjectsResult.data && !trackingReceiptCompleted}
                        >
                          {getFetchProjectsButtonName(selectedConnector)}
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
                          connectorType={selectedConnectorType}
                          connector={selectedConnector}
                          title={`Edit Connector`}
                          disabled={selectedConnector.state !== 'enabled'}
                          onSubmit={
                            submit(
                              values =>
                                editConnector({
                                  variables: {
                                    editConnectorInput: {
                                      key: selectedConnector.key,
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
                      </ButtonBarColumn>
                    </ButtonBar>
                    {
                      workItemsSources.length > 0 ?
                        <SelectProjectsTable
                          loading={loading}
                          dataSource={workItemsSources}
                          selectedProjects={selectedProjects}
                          onProjectsSelected={onProjectsSelected}
                        />
                        :
                        <NoData message={"No new projects to import"} />
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

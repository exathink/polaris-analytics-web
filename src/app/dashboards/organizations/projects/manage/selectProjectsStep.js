import {gql} from "@apollo/client";
import {Query} from "@apollo/client/react/components";
import React from "react";

import {work_tracking_service} from "../../../../services/graphql";
import Button from "../../../../../components/uielements/button";
import {withMutation} from "../../../../components/graphql/withMutation";
import {EDIT_CONNECTOR, TEST_CONNECTOR} from "../../../../components/workflow/connectors/mutations";
import {Table} from "../../../../components/tables";
import {useSearch, useSelectionHandler} from "../../../../components/tables/hooks";
import {NoData} from "../../../../components/misc/noData";
import {compose, lexicographic} from "../../../../helpers/utility";
import {EditConnectorFormButton} from "../../../../components/workflow/connectors/editConnectorFormButton";
import {withSubmissionCache} from "../../../../components/forms/withSubmissionCache";
import {getConnectorTypeProjectName} from "../../../../components/workflow/connectors/utility";
import fontStyles from "../../../../framework/styles/fonts.module.css";
import styles from "./selectProjectsStep.module.css";
import classNames from "classnames";
import {DownloadIcon} from "../../../../components/misc/customIcons";

const EDIT_CONNECTOR_WITH_CLIENT = {...EDIT_CONNECTOR, client: work_tracking_service};

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
      return 'Fetch Available Repositories with Issues';
    case 'pivotal':
      return 'Fetch Available Projects';
    case 'jira':
      return 'Fetch Available Projects';
    case 'trello':
      return 'Fetch Available Boards';
    default:
      return 'Fetch Available Projects';
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

const SelectProjectsTable = ({loading, dataSource, selectedProjects, onProjectsSelected, connectorType}) => {
  const {Column} = Table;


  return (
    <Table
      size="small"
      dataSource={dataSource}
      loading={loading}
      rowKey={record => record.key}
      pagination={{
        showTotal: total => `${total} ${getConnectorTypeProjectName(connectorType, true)}`,
        defaultPageSize: 10,
        hideOnSinglePage: true,
        position: 'top'
      }}
      rowSelection={useSelectionHandler(onProjectsSelected, selectedProjects)}
    >
      <Column
        title={`Remote ${getConnectorTypeProjectName(connectorType)} Name`}
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
    withMutation(EDIT_CONNECTOR_WITH_CLIENT, [REFETCH_CONNECTOR_WORK_ITEMS_SOURCES_QUERY])
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
                    <h5 className={classNames(styles["flex-center"], fontStyles["font-normal"], fontStyles["text-base"])}>{getServerUrl(selectedConnector)}</h5>
                    <div className={styles["flex-center"]}>
                      <h3 className={styles["titleCenter"]} data-testid="select-projects-title">Select {getConnectorTypeProjectName(connectorType, true).toLowerCase()} to import from connector {selectedConnector.name}</h3>
                    </div>
                    <div className={styles.selectProjectControls}>
                      <h4 className={styles.availableProjects}>{`${workItemsSources.length > 0 ?  workItemsSources.length : 'No'} ${getConnectorTypeProjectName(connectorType, true).toLowerCase()} available`} </h4>
                      <div className={styles.fetchProjects}>
                        <Button
                          type={'secondary'}
                          size={'small'}
                          icon={<DownloadIcon />}
                          data-testid="fetch-available-projects"
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
                      </div>
                      <div className={styles.testConnector}>
                        <Button
                          type={'primary'}
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

                      </div>
                      <div className={styles.editConnector}>
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
                                      githubAccessToken: values.githubAccessToken,
                                      trelloAccessToken: values.trelloAccessToken,
                                      trelloApiKey: values.trelloApiKey
                                    }
                                  }
                                })
                            )
                          }
                          error={editConnectorResult.error}
                          lastSubmission={lastSubmission}
                        />

                      </div>
                      
                    </div>
                    <div className={styles.selectProjectsTable}>
                    {
                      workItemsSources.length > 0 ?
                        <SelectProjectsTable
                          loading={loading}
                          dataSource={workItemsSources}
                          selectedProjects={selectedProjects}
                          onProjectsSelected={onProjectsSelected}
                          connectorType={connectorType}
                        />
                        :
                        <div style={{display: "flex", justifyContent: "center"}}><NoData message={`No new ${getConnectorTypeProjectName(connectorType, true).toLowerCase()} to import`} /></div>
                    }

                    </div>
                  </div>

                )
              }
            }
          </Query>

        )
      }
    }
  );

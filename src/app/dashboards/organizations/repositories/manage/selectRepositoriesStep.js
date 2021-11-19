import {gql} from "@apollo/client";
import {Query} from "@apollo/client/react/components";
import React from "react";

import Button from "../../../../../components/uielements/button";
import {vcs_service} from "../../../../services/graphql";
import {withMutation} from "../../../../components/graphql/withMutation";
import {EDIT_CONNECTOR, TEST_CONNECTOR} from "../../../../components/workflow/connectors/mutations";
import {Table} from "../../../../components/tables";
import {useSearch, useSelectionHandler} from "../../../../components/tables/hooks";
import {NoData} from "../../../../components/misc/noData";
import {compose, lexicographic} from "../../../../helpers/utility";
import {EditConnectorFormButton} from "../../../../components/workflow/connectors/editConnectorFormButton";
import {withSubmissionCache} from "../../../../components/forms/withSubmissionCache";
import {ThunderboltOutlined} from "@ant-design/icons";
import classNames from "classnames";
import fontStyles from "../../../../framework/styles/fonts.module.css";
import styles from "./addRepositoryWorkflow.module.css";
import {DownloadIcon} from "../../../../components/misc/customIcons";

const EDIT_CONNECTOR_WITH_CLIENT = {...EDIT_CONNECTOR, client: vcs_service};

function getServerUrl(selectedConnector) {
  switch (selectedConnector.connectorType) {
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
        hideOnSinglePage: true,
        position: 'top'
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
      />
    </Table>
  )
}

export const SelectRepositoriesStep =
  compose(
    withSubmissionCache,
    withMutation(REFETCH_REPOSITORIES_MUTATION, [REFETCH_CONNECTOR_REPOSITORIES_QUERY]),
    withMutation(TEST_CONNECTOR),
    withMutation(EDIT_CONNECTOR_WITH_CLIENT, [REFETCH_CONNECTOR_REPOSITORIES_QUERY])
  )(
    class _SelectRepositoriesStep extends React.Component {
      render() {
        const {selectedConnectorType, selectedConnector, selectedRepositories, onRepositoriesSelected, trackingReceiptCompleted, refetchRepositoriesMutation, testConnectorMutation, getActiveImports, submissionCache, editConnectorMutation} = this.props;
        const {refetchRepositories, refetchRepositoriesResult} = refetchRepositoriesMutation;
        const {submit, lastSubmission} = submissionCache;

        const {testConnector} = testConnectorMutation;
        const {editConnector, editConnectorResult} = editConnectorMutation;

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
                  <div style={{height: "100%"}} className={"selected-repositories"}>
                    <h5
                      className={classNames(styles["flex-center"], fontStyles["font-normal"], fontStyles["text-base"])}
                    >
                      {getServerUrl(selectedConnector)}
                    </h5>
                    <h3 className={styles["flex-center"]}>
                      Select repositories to import from connector {selectedConnector.name}
                    </h3>


                    <div className={styles.selectRepositoryControls}>
                      <h4 className={styles.availableRepos}>
                        {`${repositories.length > 0 ? repositories.length : "No"} repositories available`}{" "}
                      </h4>
                      <div className={styles.refreshRepos}>
                        <Button
                          type={"secondary"}
                          size={"small"}
                          icon={<DownloadIcon />}
                          onClick={() =>
                            refetchRepositories({
                              variables: {
                                connectorKey: selectedConnector.key,
                              },
                            })
                          }
                          loading={refetchRepositoriesResult.data && !trackingReceiptCompleted}
                        >
                          Refresh Available Repositories
                        </Button>
                      </div>
                      <div className={styles.activeImports}>
                        <Button
                          type={"secondary"}
                          size={"small"}
                          disabled={selectedRepositories.length}
                          onClick={getActiveImports}
                        >
                          <ThunderboltOutlined/> Active Imports
                        </Button>
                      </div>
                      <div className={styles.testConnector}>
                        <Button
                          type={"primary"}
                          size={"small"}
                          disabled={selectedConnector.state !== "enabled"}
                          onClick={() =>
                            testConnector({
                              variables: {
                                testConnectorInput: {
                                  connectorKey: selectedConnector.key,
                                },
                              },
                            })
                          }
                        >
                          {"Test Connector"}
                        </Button>
                      </div>
                      <div className={styles.editConnector}>
                        <EditConnectorFormButton
                          connectorType={selectedConnectorType}
                          connector={selectedConnector}
                          title={`Edit Connector`}
                          disabled={selectedConnector.state !== "enabled"}
                          onSubmit={submit((values) =>
                            editConnector({
                              variables: {
                                editConnectorInput: {
                                  key: selectedConnector.key,
                                  name: values.name,
                                  connectorType: selectedConnectorType,
                                  apiKey: values.apiKey,
                                  githubAccessToken: values.githubAccessToken,
                                  gitlabPersonalAccessToken: values.gitlabPersonalAccessToken,
                                  bitbucketPrincipalName: values.bitbucketPrincipalName,
                                },
                              },
                            })
                          )}
                          error={editConnectorResult.error}
                          lastSubmission={lastSubmission}
                        />
                      </div>

                    </div>
                    <div className={styles.selectReposTable}>
                      {repositories.length > 0 ? (
                        <SelectRepositoriesTable
                          loading={loading}
                          dataSource={repositories}
                          selectedRepositories={selectedRepositories}
                          onRepositoriesSelected={onRepositoriesSelected}
                        />
                      ) : (
                        <div style={{display: "flex", justifyContent: "center"}}>
                          <NoData
                            message={`No repositories to import. Click 'Refresh Available Repositories' to sync with ${getServerUrl(
                              selectedConnector
                            )}`}
                          />
                        </div>
                      )}
                    </div>
                    <div style={{marginTop: "30px"}}>
                      <p className={classNames(fontStyles["font-normal"], fontStyles["text-xs"], styles.subTitle)}>
                        <em>
                          Note: A source repository can only be registered under a single connector in an organization. If you dont see a repository you expect
                          here, check if it has been registered under a different connector for this organization. Also, please verify you have permissions
                          to access the repository using the credentials you supplied for this connector.
                        </em>
                      </p>
                    </div>
                  </div>
                );
              }
            }
          </Query>

        )
      }
    }
  );

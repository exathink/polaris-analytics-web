import {gql} from "@apollo/client";
import {Query} from "@apollo/client/react/components"
import React from "react";
import {withViewerContext} from "../../../framework/viewer/viewerContext";
import {compose} from "../../../helpers/utility";
import {withSubmissionCache} from "../../forms/withSubmissionCache";
import {ConnectorsTable} from "./connectorsTable";
import {getConnectorTypeDisplayName} from "./utility";
import {withMutation} from "../../graphql/withMutation";
import {withPollingManager} from "../../graphql/withPollingManager";
import {NewConnectorFormButton} from "./newConnectorFormButton";
import {CreateConnectorInstructions} from "./createConnectorInstructions";
import fontStyles from "../../../framework/styles/fonts.module.css";
import './connectors.css'
import styles from "./selectConnectorWidget.module.css";
import {CREATE_CONNECTOR, DELETE_CONNECTOR} from "./mutations";
import classNames from "classnames";


function urlMunge(connectorType, url) {
  if (connectorType === 'jira') {
    return `${url.startsWith('https://') ? '' : 'https://'}${url}${url.endsWith('.atlassian.net') ? '' : '.atlassian.net'}`
  }
  return url;
}


const ALL_CONNECTORS_QUERY = gql`
    query getAccountConnectors($accountKey: String!, $organizationKey: String!, $connectorType: String!) {
        connectors (accountKey: $accountKey, organizationKey: $organizationKey , connectorType: $connectorType) {
            count
            edges {
                node {
                    id
                    name
                    key
                    connectorType
                    baseUrl
                    accountKey
                    organizationKey
                    state
                    archived
                }
            }
        }
    }
`;

const REFETCH_ALL_CONNECTORS = {
  query: ALL_CONNECTORS_QUERY,
  mapPropsToVariables: props => ({
    accountKey: props.viewerContext.accountKey,
    organizationKey: props.organizationKey,
    connectorType: props.connectorType,
  })
};

export const SelectConnectorWidget =
  compose(
    withViewerContext,
    withSubmissionCache,
    withMutation(DELETE_CONNECTOR, [REFETCH_ALL_CONNECTORS]),
    withMutation(CREATE_CONNECTOR, [REFETCH_ALL_CONNECTORS]),
    withPollingManager
  )((
    {
      connectorType,
      onConnectorSelected,
      viewerContext,
      submissionCache: {
        submit,
        lastSubmission,
      },
      createConnectorMutation,
      deleteConnectorMutation,
      pollingManager: {
        polling,
        startPolling,
        stopPolling
      },
      organizationKey
    }
    ) => {
      const {createConnector, createConnectorResult} = createConnectorMutation;
      const {deleteConnector} = deleteConnectorMutation;
      return (
        <Query
          query={ALL_CONNECTORS_QUERY}
          variables={{
            accountKey: viewerContext.accountKey,
            organizationKey: organizationKey,
            connectorType: connectorType,
          }}
        >
          {
            ({loading, error, data}) => {
              if (error) return null;
              let connectors = []
              if (!loading) {
                connectors = data.connectors.edges.map(edge => edge.node).filter(node => !node.archived);
              }
              return (
                <div className={connectors.length === 0 ? styles["select-connector-not-available"]: styles["select-connector-available"]}>
                  {
                    loading || connectors.length > 0 ?
                      <React.Fragment>
                        {
                          connectors.length > 0 &&
                          <h3 className={styles["available-connectors"]} data-testid="available-connectors-title">{`Available ${getConnectorTypeDisplayName(connectorType)} Connectors`}</h3>
                        }
                        <div className={styles["select-connectors-table"]}>
                          <ConnectorsTable
                            connectorType={connectorType}
                            connectors={connectors}
                            loading={loading}
                            onConnectorSelected={onConnectorSelected}
                            onConnectorDeleted={(record) =>
                              deleteConnector({
                                variables: {
                                  deleteConnectorInput: {
                                    connectorKey: record.key,
                                  },
                                },
                              })
                            }
                          />
                      </div>
                      </React.Fragment>
                      :
                      <h3 className={classNames("flex-center", fontStyles["font-normal"], fontStyles["text-sm"], styles["no-available-connectors"], styles["subTitle"])}>{`Polaris Connectors allows you to securely import data from ${getConnectorTypeDisplayName(connectorType)}`}</h3>
                  }

                  {
                    viewerContext.isAdmin() || viewerContext.isOrganizationOwner(organizationKey) ?
                      <div className={classNames({"flex-center": connectors.length===0}, connectors.length>0 ? styles["new-connector-button"]: styles["new-connector-button-not-available"])}>
                        < NewConnectorFormButton
                          connectorType={connectorType}
                          title={`Create ${getConnectorTypeDisplayName(connectorType)} Connector`}
                          onSubmit={
                            submit(
                              values =>
                                createConnector({
                                  variables: {
                                    createConnectorInput: {
                                      name: values.name,
                                      connectorType: connectorType,
                                      accountKey: viewerContext.accountKey,
                                      organizationKey: organizationKey,
                                      baseUrl: urlMunge(connectorType, values.baseUrl),
                                      apiKey: values.apiKey,
                                      bitbucketPrincipalName: values.bitbucketPrincipalName,
                                      githubAccessToken: values.githubAccessToken,
                                      githubOrganization: values.githubOrganization,
                                      gitlabPersonalAccessToken: values.gitlabPersonalAccessToken,
                                      trelloAccessToken: values.trelloAccessToken,
                                      trelloApiKey: values.trelloApiKey,
                                      azureAccessToken: values.azureAccessToken,
                                      azureOrganization: values.azureOrganization
                                    }
                                  }
                                })
                            )
                          }
                          error={createConnectorResult.error}
                          lastSubmission={lastSubmission}
                        />
                        <CreateConnectorInstructions initial={connectors.length === 0} connectorType={connectorType}/>
                      </div>
                      :
                      connectors.length === 0 &&
                      <span>Please contact an administrator for your organization to add a connector</span>
                  }
                </div>
              )
            }
          }
        </Query>
      );
    }
  )

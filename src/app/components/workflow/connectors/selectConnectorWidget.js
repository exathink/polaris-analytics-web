import React from "react";
import {withViewerContext} from "../../../framework/viewer/viewerContext";
import {compose, Query} from "react-apollo";
import gql from "graphql-tag";
import {withSubmissionCache} from "../../forms/withSubmissionCache";
import {ConnectorsTable} from "./connectorsTable";
import {getConnectorTypeDisplayName} from "./utility";
import {withMutation} from "../../graphql/withMutation";
import {withPollingManager} from "../../graphql/withPollingManager";
import {NewConnectorFormButton} from "./newConnectorFormButton";
import {CreateConnectorInstructions} from "./createConnectorInstructions";

import './connectors.css'
import {CREATE_CONNECTOR, DELETE_CONNECTOR, REGISTER_CONNECTOR} from "./mutations";


function urlMunge(connectorType, url) {
  if (connectorType === 'jira') {
    return `${url.startsWith('https://') ? '' : 'https://'}${url}${url.endsWith('.atlassian.net') ? '' : '.atlassian.net'}`
  }
  return url;
}


const ALL_CONNECTORS_QUERY = gql`
    query getAccountConnectors($accountKey: String!, $organizationKey: String!, $connectorType: String!) {
        connectors (accountKey: $accountKey, organizationKey: $organizationKey includeNullAccounts: true, connectorType: $connectorType) {
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
    withMutation(REGISTER_CONNECTOR, [REFETCH_ALL_CONNECTORS]),
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
      registerConnectorMutation,
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
    const {registerConnector, registerConnectorResult} = registerConnectorMutation;

    return (
      <Query
        query={ALL_CONNECTORS_QUERY}
        variables={{
          accountKey: viewerContext.accountKey,
          organizationKey: organizationKey,
          connectorType: connectorType,
        }}
        pollInterval={connectorType === 'jira' ? 10000 : 0}
      >
        {
          ({loading, error, data}) => {
            if (error) return null;
            let connectors = []
            if (!loading) {
              connectors = data.connectors.edges.map(edge => edge.node).filter(node => !node.archived);
            }
            return (
              <div className={'select-connector'}>
                {
                  connectors.length > 0 ?
                    <React.Fragment>
                      <h3>{`Available ${getConnectorTypeDisplayName(connectorType)} Connectors`}</h3>
                      <ConnectorsTable
                        connectorType={connectorType}
                        connectors={connectors}
                        loading={loading}
                        onConnectorSelected={onConnectorSelected}
                        onConnectorDeleted={
                          (record) => deleteConnector({
                            variables: {
                              deleteConnectorInput: {
                                connectorKey: record.key
                              }
                            }
                          })
                        }
                        onConnectorRegistered={
                          (values) => submit(
                            values => registerConnector({
                              variables: {
                                registerConnectorInput: {
                                  accountKey: viewerContext.accountKey,
                                  organizationKey: organizationKey,
                                  connectorKey: values.key,
                                  name: values.name,
                                }
                              }
                            })
                          )(values)
                        }
                        lastRegistrationError={registerConnectorResult.error}
                        lastRegistrationSubmission={lastSubmission}
                      />
                    </React.Fragment>
                    :
                    <h3>{`No available ${getConnectorTypeDisplayName(connectorType)} Connectors`}</h3>
                }

                {
                  viewerContext.isAdmin() || viewerContext.isOrganizationOwner(organizationKey) ?
                    <React.Fragment>
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
                                    githubAccessToken: values.githubAccessToken,
                                    githubOrganization: values.githubOrganization
                                  }
                                }
                              })
                          )
                        }
                        error={createConnectorResult.error}
                        lastSubmission={lastSubmission}
                      />
                      <CreateConnectorInstructions initial={connectors.length === 0} connectorType={connectorType} />
                    </React.Fragment>
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

import React from "react";
import {withViewerContext} from "../../../framework/viewer/viewerContext";
import {compose, Query} from "react-apollo";
import {work_tracking_service} from "../../../services/graphql/index";
import gql from "graphql-tag";
import {withMutationCache} from "../../graphql/withMutationCache";
import {ConnectorsTable} from "./connectorsTable";

import {withMutation} from "../../graphql/withMutation";
import {NewConnectorFormButton} from "./newConnectorFormButton";
import {CREATE_CONNECTOR, DELETE_CONNECTOR} from "./mutations";


function urlMunge(connectorType, url) {
  if (connectorType === 'jira') {
    return `${url.startsWith('https://') ? '' : 'https://'}${url}${url.endsWith('.atlassian.net') ? '' : '.atlassian.net'}`
  }
  return url;
}


export const SelectConnectorWidget =
compose(
  withViewerContext,
  withMutationCache,
  withMutation(DELETE_CONNECTOR),
  withMutation(CREATE_CONNECTOR),
)
((
  {
    connectorType,
    onConnectorSelected,
    viewerContext,
    mutationCache: {
      mutate,
      lastSubmission,
      notify,
    },
    createConnectorMutation,
    deleteConnectorMutation,

  }
  ) => {
    notify([createConnectorMutation, deleteConnectorMutation])

    const {createConnector, createConnectorResult} = createConnectorMutation;
    const {deleteConnector, deleteConnectorResult} = deleteConnectorMutation;

    return (
      <Query
        client={work_tracking_service}
        query={
          gql`
        query getAccountConnectors($accountKey: String!, $connectorType: String!) {
            connectors (accountKey: $accountKey, includeNulls: true, connectorType: $connectorType) {
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
                    }
                }
            }
        }
        `
        }
        variables={{
          accountKey: viewerContext.accountKey,
          connectorType: connectorType,
          loading: createConnectorResult.loading || deleteConnectorResult.loading,
          data: createConnectorResult.data || deleteConnectorResult.data
        }}
        fetchPolicy={'network-only'}
        pollInterval={5000}
      >
        {
          ({loading, error, data}) => {
            if (error) return null;
            let connectors = []
            if (!loading) {
              connectors = data.connectors.edges.map(edge => edge.node);
            }
            return (
              <React.Fragment>
                <ConnectorsTable
                  connectorType={connectorType}
                  connectors={connectors}
                  loading={loading}
                  onConnectorSelected={onConnectorSelected}
                  onConnectorDeleted={
                    (record) => mutate(
                      deleteConnectorMutation,
                      () => deleteConnector({
                        variables: {
                          deleteConnectorInput: {
                            connectorKey: record.key
                          }
                        }
                      }),
                    )
                  }
                />

                <NewConnectorFormButton
                  connectorType={connectorType}
                  onSubmit={
                    mutate(
                      createConnectorMutation,
                      values => createConnector({
                        variables: {
                          createConnectorInput: {
                            name: values.name,
                            accountKey: viewerContext.accountKey,
                            connectorType: connectorType,
                            baseUrl: urlMunge(connectorType, values.baseUrl)
                          }
                        }
                      })
                    )
                  }
                  loading={createConnectorResult.loading}
                  error={createConnectorResult.error}
                  lastSubmission={lastSubmission}
                />
              </React.Fragment>
            )
          }
        }
      </Query>
    );
  }
)




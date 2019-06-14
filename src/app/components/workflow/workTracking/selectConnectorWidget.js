import React from "react";
import {withViewerContext} from "../../../framework/viewer/viewerContext";
import {compose, Query} from "react-apollo";
import {work_tracking_service} from "../../../services/graphql/index";
import gql from "graphql-tag";
import {withSubmissionCache} from "../../forms/withSubmissionCache";
import {ConnectorsTable} from "./connectorsTable";

import {withMutation} from "../../graphql/withMutation";
import {NewConnectorFormButton} from "./newConnectorFormButton";
import {CREATE_CONNECTOR, DELETE_CONNECTOR, REGISTER_CONNECTOR} from "./mutations";


function urlMunge(connectorType, url) {
  if (connectorType === 'jira') {
    return `${url.startsWith('https://') ? '' : 'https://'}${url}${url.endsWith('.atlassian.net') ? '' : '.atlassian.net'}`
  }
  return url;
}


const ALL_CONNECTORS_QUERY = gql`
    query getAccountConnectors($accountKey: String!, $connectorType: String!) {
        connectors (accountKey: $accountKey, includeNulls: true, connectorType: $connectorType) {
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
                }
            }
        }
    }
`;

const REFETCH_ALL_CONNECTORS = {
  query: ALL_CONNECTORS_QUERY,
  mapPropsToVariables: props => ({
    accountKey: props.viewerContext.accountKey,
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
  )
  ((
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

    }
    ) => {
      const {createConnector, createConnectorResult} = createConnectorMutation;
      const {deleteConnector, deleteConnectorResult} = deleteConnectorMutation;
      const {registerConnector, registerConnectorResult} = registerConnectorMutation;

      return (
        <Query
          client={work_tracking_service}
          query={ALL_CONNECTORS_QUERY}
          variables={{
            accountKey: viewerContext.accountKey,
            connectorType: connectorType,
          }}
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

                  < NewConnectorFormButton
                    connectorType={connectorType}
                    onSubmit={
                      submit(
                        values =>
                          createConnector({
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




import gql from "graphql-tag";
import {work_tracking_service} from "../../../services/graphql";
import {display_error, openNotification} from "../../../helpers/utility";

export const CREATE_CONNECTOR = {
    name: 'createConnector',
    mutation: gql`
      mutation createConnector ($createConnectorInput: CreateConnectorInput!){
          createConnector(createConnectorInput: $createConnectorInput){
              connector {
                  id
                  name
                  key
              }
          }
      }
  `,
    client: work_tracking_service,
    success: (data) => openNotification('success', `Connector ${data.createConnector.connector.name} registered`)
}

export const DELETE_CONNECTOR = {
    name: 'deleteConnector',
    mutation: gql`
      mutation deleteConnector($deleteConnectorInput: DeleteConnectorInput!) {
          deleteConnector(deleteConnectorInput:$deleteConnectorInput){
              connectorName
              disposition
          }
      }
  `,
    client: work_tracking_service,
    success: data => openNotification('success', `Connector ${data.deleteConnector.connectorName} ${data.deleteConnector.disposition}.`),
    error: err => openNotification('error', `${display_error(err)}`)
}

export const REGISTER_CONNECTOR = {
    name: 'registerConnector',
    mutation: gql`
      mutation registerConnector($registerConnectorInput: RegisterConnectorInput!) {
          registerConnector(registerConnectorInput:$registerConnectorInput){
              registered
              connector {
                  name
              }
          }
      }
  `,
    client: work_tracking_service,
    success: (data) => openNotification('success', `Connector ${data.registerConnector.connector.name} registered.`)
}

export const TEST_CONNECTOR = {
    name: 'testConnector',
    mutation: gql`
        mutation testConnector($testConnectorInput: TestConnectorInput!) {
            testConnector(testConnectorInput:$testConnectorInput){
                success
            }
        }
    `,
    client: work_tracking_service,
    success: (data) => openNotification('success', `Connector test was successful.`)
}
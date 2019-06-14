import gql from "graphql-tag";
import {work_tracking_service} from "../../../services/graphql";
import {openNotification} from "../../../helpers/utility";

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
  notification: (data) => openNotification('success', `Created connector ${data.createConnector.connector.name}`)
}

export const DELETE_CONNECTOR = {
  name: 'deleteConnector',
  mutation: gql`
      mutation deleteConnector($deleteConnectorInput: DeleteConnectorInput!) {
          deleteConnector(deleteConnectorInput:$deleteConnectorInput){
              deleted
          }
      }
  `,
  client: work_tracking_service,
  notification: (data) => openNotification('success', `Connector deleted.`)
}

export const REGISTER_CONNECTOR = {
  name: 'registerConnector',
  mutation: gql`
      mutation registerConnector($registerConnectorInput: RegisterConnectorInput!) {
          registerConnector(registerConnectorInput:$registerConnectorInput){
              registered
          }
      }
  `,
  client: work_tracking_service,
  notification: (data) => openNotification('success', `Connector registered.`)
}
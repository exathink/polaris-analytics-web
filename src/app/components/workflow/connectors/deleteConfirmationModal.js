import {gql} from "@apollo/client";
import {Query} from "@apollo/client/react/components"
import React from 'react';

import {Modal} from 'antd';
import Button from "../../../../components/uielements/button";

function disableDelete(connectorType, connector) {
  const state = connector.state;
  if (connectorType === 'jira') {
    return state === 'installed' || state === 'enabled'
  }
  return false
}

const DeleteConfirmationModal = ({record, onConnectorDeleted, onDone}) => {
  return (
    <Query
      query={
        gql`
          query getConnectorAttachedCount($connectorKey: String!){
              workTrackingConnector(key: $connectorKey) {
                id
                workItemsSources(attachedOnly:true, summariesOnly: true){
                      count
                }
              }
          }
      `}
      variables={{
        connectorKey: record.key
      }}
      notifyOnNetworkStatusChange={true}
      onCompleted={
        (data) => {
          if (data.workTrackingConnector.workItemsSources.count === 0) {
            onConnectorDeleted(record)
          }
        }
      }
    >
      {
        ({loading, error, data}) => {
          if (loading || error) return null;
          const count = data.workTrackingConnector.workItemsSources.count;
          if (count > 0) {
            return (
              <Modal
                title={`Archive Connector ${record.name}? `}
                visible={true}
                onOk={
                  () => {
                    onConnectorDeleted(record)
                    onDone()
                  }
                }
                onCancel={
                  () => {
                    onDone()
                  }}
                okText={'Archive'}
              >
                <p>Remote projects have been imported using this connector,
                  so this connector cannot be deleted, only archived. </p>

                <p>Archiving means
                  the connector will no longer show up as an import source.
                  Projects imported via this connector will be preserved, but they will no longer be updated.
                </p>

              </Modal>
            )
          } else {
            return null;
          }
        }
      }
    </Query>
  )
}


export class DeleteConfirmationModalButton extends React.Component {

  state = {
    modal: false
  }

  showModal() {
    this.setState({
      modal: true
    })
  }

  hideModal() {
    this.setState({
      modal: false
    })
  }

  render() {
    const {record, connectorType, onConnectorDeleted} = this.props;

    return (
      <React.Fragment>
        <Button
          size={"small"}
          type={'primary'}
          onClick={this.showModal.bind(this)}
          disabled={disableDelete(connectorType, record)}
        >
          Delete
        </Button>
        {
          this.state.modal &&
            <DeleteConfirmationModal
              record={record}
              onConnectorDeleted={onConnectorDeleted}

              onDone={this.hideModal.bind(this)}
            />
        }
      </React.Fragment>
    )
  }
}
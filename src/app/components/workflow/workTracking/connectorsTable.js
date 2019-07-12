import {Table, Modal } from "antd";
import {ButtonBar} from "../../../containers/buttonBar/buttonBar";
import Button from "../../../../components/uielements/button";
import React from "react";
import {NoData} from "../../misc/noData";
import {RegisterConnectorFormButton} from "./registerConnectorFormButton";
import './connectorsTable.css'
const { confirm } = Modal;

function disableDelete(connectorType, connector) {
  const state = connector.state;
  if (connectorType === 'jira') {
    return state === 'installed' || state === 'enabled'
  }
  return false
}

export const ConnectorsTable = (
  {
    connectorType,
    connectors,
    loading,
    onConnectorSelected,
    onConnectorDeleted,
    onConnectorRegistered,
    lastRegistrationError,
    lastRegistrationSubmission
  }
) => {

  return (
      <div className={'connectors-table'}>
        {
          loading || connectors.length > 0 ?
            <Table
              dataSource={connectors}
              loading={loading}
              rowKey={record => record.id}
              pagination={{
                total: connectors.length,
                defaultPageSize: 5,
                hideOnSinglePage: true
              }}
            >
              <Table.Column title={"Name"} dataIndex={"name"} key={"name"}/>
              <Table.Column title={"Host"} dataIndex={"baseUrl"} key={"baseUrl"}/>
              <Table.Column title={"State"} dataIndex={"state"} key={"state"}/>
              <Table.Column
                title=""
                width={80}
                key="select"
                render={
                  (text, record) => {
                    const lastRegistrationKey = lastRegistrationSubmission && lastRegistrationSubmission.key

                    return (
                      <ButtonBar>
                        {
                          record.accountKey != null ?
                            <Button
                              size={"small"}
                              type={'primary'}
                              onClick={() => onConnectorSelected(record)}
                              disabled={record.state !== 'enabled'}

                            >
                              Select
                            </Button>
                            :
                            <RegisterConnectorFormButton
                              connectorType={connectorType}
                              connector={record}
                              onSubmit={
                                (values) =>
                                  onConnectorRegistered(Object.assign(values, {key: record.key}))
                              }
                              error={record.key === lastRegistrationKey ? lastRegistrationError : null}
                              lastSubmission={record.key === lastRegistrationKey ? lastRegistrationSubmission : null}
                            />
                        }

                        <Button
                          size={"small"}
                          type={'primary'}
                          onClick={
                            () =>   {
                              /*
                              `{
                                workTrackingConnector(key:record.key) {
                                      workItemsSources(attachedOnly:true, summariesOnly: true){
                                            count
                                      }
                                  }
                              }`
                            */
                              const workItems = 55;
                              console.log(record) 
                              confirm({
                                okText: 'Delete',
                                title: `Do you want to delete connector ${record.name}?`,
                                content: `There are ${workItems} remote projects that have been imported into the system. Would you like to archive this connector instead? Archiving preserves existing data, but the connector will no longer show up as an import source. Also projects imported via this connector will no longer be updated in the system.`,
                                onOk() {
                                  return new Promise((resolve, reject) => {
                                    onConnectorDeleted(record)
                                    .then(() => resolve())
                                  });
                                },
                                onCancel() {},
                              });
                            }
                          }
                          disabled={disableDelete(connectorType, record)}
                        >
                          Delete
                        </Button>
                      </ButtonBar>
                    )
                  }
                }
              />
            </Table>
            :
            <NoData message={`No ${connectorType} connectors registered.`}/>
        }
      </div>

  )
}

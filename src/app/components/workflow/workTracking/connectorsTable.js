import {Table} from "antd";
import {ButtonBar} from "../../../containers/buttonBar/buttonBar";
import Button from "../../../../components/uielements/button";
import React from "react";
import {NoData} from "../../misc/noData";
import {RegisterConnectorFormButton} from "./registerConnectorFormButton";
import './connectorsTable.css'

function disableDelete(connectorType, state) {
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
                            () => onConnectorDeleted(record)
                          }
                          disabled={disableDelete(connectorType, record.state)}
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

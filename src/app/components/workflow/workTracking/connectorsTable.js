import {Table} from "antd";
import {ButtonBar} from "../../../containers/buttonBar/buttonBar";
import Button from "../../../../components/uielements/button";
import React from "react";
import {NoData} from "../../misc/noData";
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
    onConnectorDeleted
  }
) => (
  <div className={'connectors-table'}>
    {
      connectors.length > 0 ?
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
              (text, record) =>
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
                      <Button
                        size={"small"}
                        type={'primary'}
                      >
                        Register
                      </Button>
                  }

                  <Button
                    size={"small"}
                    type={'primary'}
                    onClick={
                      onConnectorDeleted(record)
                    }
                    disabled={disableDelete(connectorType, record.state)}
                  >
                    Delete
                  </Button>
                </ButtonBar>
            }
          />
        </Table>
        :
        <NoData loading={loading} message={`No ${connectorType} connectors registered.`}/>
    }
  </div>
)
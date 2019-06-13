import React from "react";
import {withViewerContext} from "../../../../framework/viewer/viewerContext";
import {compose, Query} from "react-apollo";
import {work_tracking_service} from "../../../../services/graphql";
import gql from "graphql-tag";
import {Col, Form, Input, Radio, Row, Table} from "antd";
import {createForm} from "../../../../components/forms/createForm";

import Button from "../../../../../components/uielements/button";
import {ButtonBar} from "../../../../containers/buttonBar/buttonBar";
import {withMutationCache} from "../../../../components/graphql/withMutationCache";
import {NoData} from "../../../../components/misc/noData";

import {withMutation} from "../../../../components/graphql/withMutation";
import {openNotification} from "../../../../helpers/utility";


function urlMunge(connectorType, url) {
  if (connectorType === 'jira') {
    return `${url.startsWith('https://') ? '' : 'https://'}${url}${url.endsWith('.atlassian.net') ? '' : '.atlassian.net'}`
  }
  return url;
}

const CREATE_CONNECTOR = {
  name: 'createConnector',
  mutation: gql`
      mutation createConnector ($createConnectorInput: CreateConnectorInput!){
          createConnectors(createConnectorInput: $createConnectorInput){
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


const DELETE_CONNECTOR = {
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

export class SelectConnectorStep extends React.Component {
  state = {
    connectorType: 'jira'
  }

  onConnectorTypeChanged(e) {
    this.setState({
      connectorType: e.target.value
    })
  }


  render() {
    const connectorType = this.state.connectorType;
    return (
      <div className={'select-connector'}>

        <Radio.Group
          name="connectorType"
          value={this.state.connectorType}
          buttonStyle={"solid"}
          onChange={this.onConnectorTypeChanged.bind(this)}
        >
          <Radio.Button value={'jira'}>Jira</Radio.Button>
          <Radio.Button value={'pivotal'}>Pivotal Tracker</Radio.Button>
          <Radio.Button value={'github'}>Github</Radio.Button>
        </Radio.Group>

        <SelectConnectorWidget connectorType={connectorType}
                               onConnectorSelected={this.props.onConnectorSelected}/>
      </div>
    )
  }
}

const AddConnector = (
  {
    connectorType,
    currentValue,
    onSubmit,
    form: {
      getFieldDecorator
    }
  }
) => {
  return (
    <React.Fragment>
      <Row gutter={16}>
        <Col span={24}>
          <Form.Item label="Name">
            {getFieldDecorator('name', {
              rules: [
                {required: true, message: 'Name is required'}
              ],
              initialValue: currentValue('name', null)
            })(<Input placeholder="name"/>)}
          </Form.Item>
        </Col>
      </Row>
      {
        connectorType === 'jira' ?
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item label="Atlassian Server URL">
                {getFieldDecorator('baseUrl', {
                  rules: [
                    {required: true, message: 'Server is required'}
                  ],
                  initialValue: currentValue('baseUrl', null)
                })(
                  <Input
                    placeholder="<company>"
                    addonBefore="https://"
                    addonAfter=".atlassian.net"
                  />
                )}
              </Form.Item>
            </Col>
          </Row>
          :
          null
      }
      {
        connectorType === 'pivotal' ?
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item label="API Key">
                {getFieldDecorator('apiKey', {
                  rules: [
                    {required: true, message: 'Api Key is required'}
                  ],
                  initialValue: currentValue('apiKey', null)
                })(<Input placeholder="API Key"/>)}
              </Form.Item>
            </Col>
          </Row>
          :
          null
      }
    </React.Fragment>
  )
}

export const AddConnectorForm = createForm(AddConnector, {
  drawer: true,
  title: 'New Connector',
  submitTitle: 'Create'
});


function disableDelete(connectorType, state) {
  if (connectorType === 'jira') {
    return state === 'installed' || state === 'enabled'
  }
  return false
}

const SelectConnectorWidget =
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
                                    mutate(
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
                <AddConnectorForm
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




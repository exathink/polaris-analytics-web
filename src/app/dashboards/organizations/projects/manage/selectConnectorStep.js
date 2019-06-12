import React from "react";
import {withViewerContext} from "../../../../framework/viewer/viewerContext";
import {Mutation, Query} from "react-apollo";
import {work_tracking_service} from "../../../../services/graphql";
import gql from "graphql-tag";
import {Col, Form, Input, Radio, Row, Table} from "antd";
import {createForm} from "../../../../components/forms/createForm";

import Button from "../../../../../components/uielements/button";
import {withSubmissionCache} from "../../../../components/forms/withSubmissionCache";
import {NoData} from "../../../../components/misc/noData";


function urlMunge(connectorType, url) {
  if (connectorType === 'jira') {
    return `${url.startsWith('https://') ? '' : 'https://'}${url}${url.endsWith('.atlassian.net') ? '' : '.atlassian.net'}`
  }
  return url;
}

const CREATE_CONNECTOR = gql`
    mutation createConnector ($createConnectorInput: CreateConnectorInput!){
        createConnector(createConnectorInput: $createConnectorInput){
            connector {
                id
                name
                key
            }
        }
    }
`
const DELETE_CONNECTOR = gql`
    mutation deleteConnector($deleteConnectorInput: DeleteConnectorInput!) {
        deleteConnector(deleteConnectorInput:$deleteConnectorInput){
            deleted
        }
    }
`


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

        <SelectConnector connectorType={connectorType}
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
  title: 'Create Connector',
  submitTitle: 'Create'
});


const SelectConnectorWidget = (
  {
    viewerContext,
    connectorType,
    onConnectorSelected,
    addConnectorForm,
    deleteConnector,
    newData,
    updating
  }
) => (
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
      newData: newData,
      updating: updating
    }}
    fetchPolicy={newData ? 'network-only' : 'cache-first'}
    pollInterval={newData ? 5000 : 0}
  >
    {
      ({loading, error, data}) => {
        if (error) return null;
        let connectors = []
        if (!loading) {
           connectors = data.connectors.edges.map(edge => edge.node)
        }
        const showLoading = loading || updating

        return (
          <React.Fragment>
            <div className={'connectors-table'}>
              {
                connectors.length > 0 ?
                  <Table
                    dataSource={connectors}
                    loading={showLoading}
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
                      key="select"
                      render={
                        (text, record) =>
                          <Button type={'primary'}
                                  onClick={() => onConnectorSelected(record)}
                                  disabled={record.accountKey !== viewerContext.accountKey || record.state !== 'enabled'}

                          >
                            Select
                          </Button>
                      }
                    />
                    <Table.Column
                      title=""
                      key="delete"
                      render={
                        (text, record) =>
                          <Button type={'primary'}
                                  onClick={
                                    () => deleteConnector({
                                      variables: {
                                        deleteConnectorInput: {
                                          connectorKey: record.key
                                        }
                                      }
                                    })
                                  }
                                  disabled={record.state === 'enabled'}
                          >
                            Delete
                          </Button>
                      }
                    />
                  </Table>
                  :
                  <NoData loading={showLoading} message={`No ${connectorType} connectors registered.`}/>
              }
            </div>
            {React.createElement(addConnectorForm)}
          </React.Fragment>
        )
      }
    }
  </Query>
)


const SelectConnector =
  withSubmissionCache(
    withViewerContext(
      (
        {
          viewerContext,
          connectorType,
          onConnectorSelected,
          submissionCache: {
            submit,
            lastSubmission
          }
        }
      ) => (
        <Mutation
          mutation={DELETE_CONNECTOR}
          client={work_tracking_service}
        >
          {
            (deleteConnector, deleteConnectorResult) => (
              <Mutation
                mutation={CREATE_CONNECTOR}
                client={work_tracking_service}
              >
                {
                  (createConnector, createConnectorResult) => {
                    const data = deleteConnectorResult.data || createConnectorResult.data;
                    const updating = deleteConnectorResult.loading || createConnectorResult.loading;

                    return (

                      <SelectConnectorWidget
                        viewerContext={viewerContext}
                        connectorType={connectorType}
                        onConnectorSelected={onConnectorSelected}
                        addConnectorForm={
                          () =>
                            <AddConnectorForm
                              connectorType={connectorType}
                              onSubmit={
                                submit(
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
                              values={lastSubmission}
                            />
                        }
                        newData={data}
                        updating={updating}
                        deleteConnector={deleteConnector}
                      />
                    )
                  }
                }
              </Mutation>
            )
          }
        </Mutation>
      )
    )
  )



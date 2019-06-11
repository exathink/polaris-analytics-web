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
    return `${url.startsWith('https://') ? '' : 'https://'}${url}${url.endsWith('.atlassian.net')? '' : '.atlassian.net'}`
  }
  return url;
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


const SelectConnectorWidget = ({viewerContext, connectorType, onConnectorSelected, addConnectorForm, newData}) => (
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
      connectorType: connectorType
    }}
    pollInterval={5000}
  >
    {
      ({loading, error, data}) => {
        if (error) return null;
        if (loading) return null;
        const connectors = data.connectors.edges.map(edge => edge.node)
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
                      key="action"
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
                  </Table>
                  :
                  <NoData message={`No ${connectorType} connectors registered.`}/>
              }
            </div>
            {React.createElement(addConnectorForm)}
          </React.Fragment>
        )
      }
    }
  </Query>
)

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
          mutation={CREATE_CONNECTOR}
          client={work_tracking_service}
        >
          {
            (createConnector, {data, loading, error}) => {
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
                        loading={loading}
                        error={error}
                        values={lastSubmission}
                      />
                  }
                  newData={data && data.createConnector}
                />
              )
            }
          }
        </Mutation>
      )
    )
  )



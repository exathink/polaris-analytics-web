import {createForm} from "../../forms/createForm";
import React from "react";
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Col, Input, Row } from "antd";
import {CreateConnectorInstructions} from "./createConnectorInstructions";

const PARTS = ['instructions', 'setup']
const PART_OPTIONS = {
  company: {
    title: 'Instructions'
  },
  setup: {
    title: 'Setup'
  }
}

const AddConnectorForm = (
  {
    part,
    connectorType,
    currentValue,
    onSubmit,
    form: {
      getFieldDecorator
    }
  }
) => {
  return (
    part === 'instructions' ?
      <CreateConnectorInstructions part={part} connectorType={connectorType}/>
      :
      <React.Fragment>
        <CreateConnectorInstructions part={part} connectorType={connectorType}/>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item label="Connector Name">
              {getFieldDecorator('name', {
                rules: [
                  {required: true, message: 'Name is required'}
                ],
                initialValue: currentValue('name', null)
              })(<Input placeholder="The display name for this connector in Polaris"/>)}
            </Form.Item>
          </Col>
        </Row>

        {
          connectorType === 'jira' ?
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item label="Jira Server URL">
                  {getFieldDecorator('baseUrl', {
                    rules: [
                      {required: true, message: 'Jira Server is required'}
                    ],
                    initialValue: currentValue('baseUrl', null)
                  })(
                    <Input
                      placeholder="the name of the Jira server where you installed the connector app"
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
          connectorType === 'bitbucket' ?
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item label="BitBucket Workspace Identifier">
                  {getFieldDecorator('bitbucketPrincipalName', {
                    rules: [
                      {required: true, message: 'Bitbucket workspace identifier is required'}
                    ],
                    initialValue: currentValue('bitbucketPrincipalName', null)
                  })(
                    <Input
                      placeholder="the Workspace ID for the workspace where the connector was installed (see instructions)"
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
        {
          connectorType === 'github' ?
            <React.Fragment>

              <Row gutter={16}>
                <Col span={24}>
                  <Form.Item label="OAuth Personal Access Token">
                    {getFieldDecorator('githubAccessToken', {
                      rules: [
                        {required: true, message: 'OAuth Access Token'}
                      ],
                      initialValue: currentValue('githubAccessToken', null)
                    })(<Input placeholder="OAuth Access Token"/>)}
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={24}>
                  <Form.Item label="Github Organization">
                    {getFieldDecorator('githubOrganization', {
                      rules: [
                        {message: 'Github Organization'}
                      ],
                      initialValue: currentValue('githubOrganization', null)
                    })(<Input placeholder="Limits visibility to repos from a single Github Organization (optional)"/>)}
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={1}>
                <Col span={24}>
                  <div>
                    <em>
                      Note: If you dont specify an organization here, you will need to create a separate connector
                      to limit visibility to a specific organization later on. We strongly recommend that you scope connectors
                      to specific github organizations, even though it is an optional field.
                    </em>
                  </div>
                </Col>
              </Row>
            </React.Fragment>
            :
            null
        }
        {
          connectorType === 'gitlab' ?
            <React.Fragment>
              <Row gutter={16}>
                <Col span={24}>
                  <Form.Item label="Gitlab Host URL">
                    {getFieldDecorator('baseUrl', {
                      rules: [
                        {required: false, message: 'Gitlab Host URL'}
                      ],
                      initialValue: currentValue('baseUrl', null)
                    })(<Input placeholder="Leave empty for Gitlab Cloud. For Gitlab Enterprise provide server URL. "/>)}
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={24}>
                  <Form.Item label="Personal Access Token">
                    {getFieldDecorator('gitlabPersonalAccessToken', {
                      rules: [
                        {required: true, message: 'Personal Access Token is required'}
                      ],
                      initialValue: currentValue('gitlabPersonalAccessToken', null)
                    })(<Input placeholder="Personal Access Token"/>)}
                  </Form.Item>
                </Col>
              </Row>
            </React.Fragment>
            :
            null
        }
        {
          connectorType === 'trello' ?
            <React.Fragment>
              <Row gutter={16}>
                <Col span={24}>
                  <Form.Item label="Trello Host URL">
                    {getFieldDecorator('baseUrl', {
                      rules: [
                        {required: false, message: 'Trello Host URL'}
                      ],
                      initialValue: currentValue('baseUrl', null)
                    })(<Input placeholder="Defaults to https://api.trello.com"/>)}
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
              <Col span={24}>
                <Form.Item label="API Key">
                  {getFieldDecorator('trelloApiKey', {
                    rules: [
                      {required: true, message: 'Api Key is required'}
                    ],
                    initialValue: currentValue('trelloApiKey', null)
                  })(<Input placeholder="API Key"/>)}
                </Form.Item>
              </Col>
            </Row>
              <Row gutter={16}>
                <Col span={24}>
                  <Form.Item label="Personal Access Token">
                    {getFieldDecorator('trelloAccessToken', {
                      rules: [
                        {required: true, message: 'Personal Access Token is required'}
                      ],
                      initialValue: currentValue('trelloAccessToken', null)
                    })(<Input placeholder="Personal Access Token"/>)}
                  </Form.Item>
                </Col>
              </Row>
            </React.Fragment>
            :
            null
        }
        {
          connectorType === 'azure' ?
            <React.Fragment>

              <Row gutter={16}>
                <Col span={24}>
                  <Form.Item label="Personal Access Token">
                    {getFieldDecorator('azureAccessToken', {
                      rules: [
                        {required: true, message: 'Personal Access Token'}
                      ],
                      initialValue: currentValue('azureAccessToken', null)
                    })(<Input placeholder="Personal Access Token"/>)}
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={24}>
                  <Form.Item label="Azure DevOps Organization">
                    {getFieldDecorator('azureOrganization', {
                      rules: [
                        {required: true, message: 'Azure DevOps Organization'}
                      ],
                      initialValue: currentValue('azureOrganization', null)
                    })(<Input placeholder="Specify the Azure DevOps Organization"/>)}
                  </Form.Item>
                </Col>
              </Row>
            </React.Fragment>
            :
            null
        }
      </React.Fragment>
  )
}
export const NewConnectorFormButton = createForm(AddConnectorForm, {
  drawer: true,
  title: 'New Connector',
  submitTitle: 'Register',
  parts: PARTS,
  partOptions: PART_OPTIONS,
});



import {createForm} from "../../forms/createForm";
import React from "react";
import {Col, Form, Input, Row} from "antd";
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
              })(<Input placeholder="The display name for this connector in Urjuna"/>)}
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
                  <Form.Item label="Github Organization">
                    {getFieldDecorator('githubOrganization', {
                      rules: [
                        {required: true, message: 'Github Organization'}
                      ],
                      initialValue: currentValue('githubOrganization', null)
                    })(<Input placeholder="Github Organization"/>)}
                  </Form.Item>
                </Col>
              </Row>
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



import {createForm} from "../../forms/createForm";
import React from "react";
import {Col, Form, Input, Row} from "antd";

const RegisterConnectorForm = (
  {
    connectorType,
    connector,
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
              initialValue: currentValue('name', connector.name)
            })(<Input placeholder="name" />)}
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
                  initialValue: connector.baseUrl
                })(
                  <Input
                    disabled={true}
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
                  initialValue: connector.apiKey,
                })(<Input disabled={true} placeholder="API Key" />)}
              </Form.Item>
            </Col>
          </Row>
          :
          null
      }
    </React.Fragment>
  )
}
export const RegisterConnectorFormButton = createForm(RegisterConnectorForm, {
  drawer: true,
  title: 'Register',
  submitTitle: 'Register',
  buttonSize: 'small',
  noPlus: true
});
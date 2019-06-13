import {createForm} from "../../forms/createForm";
import React from "react";
import {Col, Form, Input, Row} from "antd";

const AddConnectorForm = (
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
export const NewConnectorFormButton = createForm(AddConnectorForm, {
  drawer: true,
  title: 'New Connector',
  submitTitle: 'Register'
});
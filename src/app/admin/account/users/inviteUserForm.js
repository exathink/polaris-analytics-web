import React from "react";
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Col, Input, Row, Select } from "antd";

import {createForm} from "../../../components/forms/createForm";
import {withViewerContext} from "../../../framework/viewer/viewerContext";

const {Option} = Select;

const InviteUser = withViewerContext((
  {
    viewerContext: {viewer, getViewerOrganizations},
    currentValue,
    onSubmit,
    form: {
      getFieldDecorator
    }
  }
) => {
  const organizations = getViewerOrganizations('owner');

  return (
    <Form layout="vertical" hideRequiredMark onSubmit={onSubmit}>
      <Row gutter={16}>
        <Col span={24}>
          <Form.Item label="Email">
            {getFieldDecorator('email', {
              rules: [
                {type: 'email', message: 'The input is not a valid email'},
                {required: true, message: 'Email is required'}
              ],
              initialValue: currentValue('email', null)
            })(<Input placeholder="email"/>)}
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item label="First name">
            {getFieldDecorator('firstName', {
              rules: [
                {required: true, message: 'First name is required'}
              ],
              initialValue: currentValue('firstName', null)
            })(<Input placeholder="first name"/>)}
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item label="Last name">
            {getFieldDecorator('lastName', {
              rules: [
                {required: true, message: 'Last name is required'}
              ],
              initialValue: currentValue('lastName', null)
            })(<Input placeholder="last name"/>)}
          </Form.Item>
        </Col>
        <Col span={24}>
          {
            organizations.length > 0 ?
              <Form.Item label="Organizations">
                {getFieldDecorator('organizations', {
                  rules: [
                    {required: true, message: 'At least one organization must be selected.'}
                  ],
                  initialValue: currentValue('organizations', [organizations[0].key])
                })(
                  <Select
                    mode="multiple"
                    placeholder="please select"
                  >
                    {
                      getViewerOrganizations('owner').map(
                        organization => <Option key={organization.key}>{organization.name}</Option>
                      )
                    }
                  </Select>
                )}
              </Form.Item>
              :
              null
          }
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          A new user account will be created if necessary and the user will be invited to join using the the specified email.
          The user will be member of the account {viewer.account.name} and will also join the specified organizations as a member.
        </Col>
      </Row>
    </Form>
  )
});


export const InviteUserForm = createForm(InviteUser, {drawer: true, title: 'Invite User', submitTitle: 'Invite'});

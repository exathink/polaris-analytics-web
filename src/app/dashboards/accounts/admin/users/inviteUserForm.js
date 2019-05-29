import React from "react";
import {Col, Divider, Form, Input, Row, Select} from "antd";
import {withSubmissionHandler} from "../../../../components/forms/withSubmissionHandler";
import {withFormDrawer} from "../../../../components/forms/withFormDrawer";
import {withViewerContext} from "../../../../framework/viewer/viewerContext";

const {Option} = Select;

const FORM_TITLE = 'Invite user';
const InviteUser = withViewerContext((
  {
    viewerContext: {viewer, getViewerOrganizations},
    form: {
      getFieldDecorator
    },
    submissionHandler: {
      initialValue,
      onSubmit
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
              initialValue: initialValue('email', null)
            })(<Input placeholder="email"/>)}
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item label="First name">
            {getFieldDecorator('firstName', {
              rules: [
                {required: true, message: 'First name is required'}
              ],
              initialValue: initialValue('firstName', null)
            })(<Input placeholder="first name"/>)}
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item label="Last name">
            {getFieldDecorator('lastName', {
              rules: [
                {required: true, message: 'Last name is required'}
              ],
              initialValue: initialValue('lastName', null)
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
                  initialValue: initialValue('organizations', [organizations[0].key])
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


export const InviteUserForm = Form.create()(withSubmissionHandler(withFormDrawer(FORM_TITLE, InviteUser, 'Invite')));

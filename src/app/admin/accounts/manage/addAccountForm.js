import React from "react";
import Button from "../../../../components/uielements/button";
import {Col, DatePicker, Drawer, Form, Icon, Input, Row, Select, Divider} from "antd";
import {notification} from "antd";
import {withSubmissionHandler} from "../../../components/forms/withSubmissionHandler";
import {withFormDrawer} from "../../../components/forms/withFormDrawer";

const {Option} = Select;

const FORM_TITLE = 'Add a new account';
const AddAccount = (
  {
    form: {
      getFieldDecorator
    },
    submissionHandler: {
      initialValue,
      onSubmit
    }
  }
) => (
  <Form layout="vertical" hideRequiredMark onSubmit={onSubmit}>
    <Row gutter={16}>
      <Col span={24}>
        <Form.Item label="Company">
          {getFieldDecorator('company', {
            rules: [{required: true, message: 'Company name is required'}],
            initialValue: initialValue('company', null)
          })(<Input placeholder="Company"/>)}
        </Form.Item>
      </Col>
    </Row>
    <Divider orientation={'left'}> Account Owner</Divider>
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
        <Form.Item label="First Name">
          {getFieldDecorator('firstName', {
            rules: [{required: true, message: 'First name is required'}],
            initialValue: initialValue('firstName', null)
          })(<Input placeholder="First Name"/>)}
        </Form.Item>
      </Col>
      <Col span={24}>

        <Form.Item label="Last Name">
          {getFieldDecorator('lastName', {
            rules: [{required: true, message: 'Last name is required'}],
            initialValue: initialValue('lastName', null)
          })(<Input placeholder="Last Name"/>)}
        </Form.Item>
      </Col>

    </Row>
    <Row>
      <Col span={24}>
        An account will be created with the company name, and this will also be the name of the default organization
        for the account. A user with the specified email will be assigned as the account owner. A new user will be created
        if needed and invited to the account as account owner.
      </Col>
    </Row>
  </Form>
);


export const AddAccountForm = Form.create()(withSubmissionHandler(withFormDrawer(FORM_TITLE, AddAccount)));

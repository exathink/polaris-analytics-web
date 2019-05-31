import React from "react";
import Button from "../../../../components/uielements/button";
import {Col, DatePicker, Drawer, Form, Icon, Input, Row, Select, Divider} from "antd";
import {notification} from "antd";
import {withSubmissionHandler} from "../../../components/forms/withSubmissionHandler";
import {withFormDrawer} from "../../../components/forms/withFormDrawer";

const {Option} = Select;
const PARTS = ['COMPANY', 'OWNER']
const FORM_TITLE = 'Add a new account';
const AddAccount = (
  {
    part,
    currentValue,
    form: {
      getFieldDecorator
    },
    submissionHandler: {
      onSubmit
    }
  }
) => (
      part === 'COMPANY' ?
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item label="Company">
              {getFieldDecorator('company', {
                rules: [{required: true, message: 'Company name is required'}],
                initialValue: currentValue('company', null)
              })(<Input placeholder="Company"/>)}
            </Form.Item>
          </Col>
        </Row>
        :
      part === 'OWNER' ?
        <React.Fragment>
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
              <Form.Item label="First Name">
                {getFieldDecorator('firstName', {
                  rules: [{required: true, message: 'First name is required'}],
                  initialValue: currentValue('firstName', null)
                })(<Input placeholder="First Name"/>)}
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label="Last Name">
                {getFieldDecorator('lastName', {
                  rules: [{required: true, message: 'Last name is required'}],
                  initialValue: currentValue('lastName', null)
                })(<Input placeholder="Last Name"/>)}
              </Form.Item>
            </Col>
          </Row>
          < Row>
            <Col span={24}>
              An account will be created with the company name, and this will also be the name of the default
              organization
              for the account. A user with the specified email will be assigned as the account owner. A new user will be
              created
              if needed and invited to the account as account owner.
            </Col>
          </Row>
        </React.Fragment>
        :
        null
);


export const AddAccountForm = Form.create()(withSubmissionHandler(withFormDrawer(FORM_TITLE, AddAccount, 'Create', PARTS)));

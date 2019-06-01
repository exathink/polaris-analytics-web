import React from "react";
import {Col, Form, Input, Row, Select} from "antd";
import {createForm} from "../../../components/forms/createForm";

const {Option} = Select;
const PARTS = ['company', 'owner']
const PART_OPTIONS = {
  company: {
    title: 'Account'
  },
  owner: {
    title: 'Account Owner'
  }
}
const AddAccount = (
  {
    part,
    currentValue,
    onSubmit,
    form: {
      getFieldDecorator
    }
  }
) => (
      part === 'company' ?
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
      part === 'owner' ?
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


export const AddAccountForm = createForm(AddAccount, {drawer: true, title: 'Add New Account', submitTitle: 'Create', parts: PARTS, partOptions: PART_OPTIONS});

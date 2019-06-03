import React from "react";
import {Col, Form, Input, Radio, Row, Select} from "antd";
import {createForm} from "../../../components/forms/createForm";

const {Option} = Select;
const PARTS = ['company', 'organization', 'owner']
const PART_OPTIONS = {
  company: {
    title: 'Account'
  },
  organization: {
    title: 'Default Organization'
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
    <React.Fragment>
      <Row gutter={16}>
        <Col span={24}>
          <Form.Item label="Name">
            {getFieldDecorator('accountName', {
              rules: [{required: true, message: 'Account name is required'}],
              initialValue: currentValue('accountName', null)
            })(<Input placeholder="Account name"/>)}
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={24}>
          <Form.Item label="Work Tracking Default">
            {getFieldDecorator('accountWorkTracking', {
              rules: [{required: true, message: 'A value must be selected'}],
              initialValue: currentValue('accountWorkTracking', 'none')
            })(
              <Radio.Group name="inputType" defaultValue={'none'} buttonStyle={"solid"}>
                <Radio.Button value={'none'}>None</Radio.Button>
                <Radio.Button value={'jira'}>Jira</Radio.Button>
                <Radio.Button value={'pivotal'}>Pivotal Tracker</Radio.Button>
                <Radio.Button value={'github'}>Github</Radio.Button>
              </Radio.Group>
            )}
          </Form.Item>

        </Col>
      </Row>
    </React.Fragment>
    :
    part === 'organization' ?
      <React.Fragment>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item label="Name">
              {getFieldDecorator('organizationName', {
                rules: [{required: true, message: 'Organization name is required'}],
                initialValue: currentValue('organizationName', currentValue('accountName', null))
              })(<Input placeholder="Organization name"/>)}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item label="Work Tracking">
              {getFieldDecorator('organizationWorkTracking', {
                rules: [{required: true, message: 'A value must be selected'}],
                initialValue: currentValue('organizationWorkTracking', currentValue('accountWorkTracking', 'none'))
              })(
                <Radio.Group name="inputType" defaultValue={'none'} buttonStyle={"solid"}>
                  <Radio.Button value={'none'}>None</Radio.Button>
                  <Radio.Button value={'jira'}>Jira</Radio.Button>
                  <Radio.Button value={'pivotal'}>Pivotal Tracker</Radio.Button>
                  <Radio.Button value={'github'}>Github</Radio.Button>
                </Radio.Group>
              )}
            </Form.Item>
          </Col>
        </Row>
      </React.Fragment>
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


export const AddAccountForm = createForm(AddAccount, {
  drawer: true,
  title: 'Add New Account',
  submitTitle: 'Create',
  parts: PARTS,
  partOptions: PART_OPTIONS
});

import React from "react";
import Button from "../../../../components/uielements/button";
import {Col, DatePicker, Drawer, Form, Icon, Input, Row, Select} from "antd";
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
  </Form>
);


export const AddAccountForm = Form.create()(withSubmissionHandler(withFormDrawer(FORM_TITLE, AddAccount)));

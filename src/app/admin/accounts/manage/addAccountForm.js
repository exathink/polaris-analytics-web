import React from "react";
import Button from "../../../../components/uielements/button";
import {Col, DatePicker, Drawer, Form, Icon, Input, Row, Select} from "antd";
import {notification} from "antd";
import {withSubmissionHandler} from "../../../components/forms/withSubmissionHandler";

const {Option} = Select;

const AddAccountFormDrawer = (
  {
    form: {
      getFieldDecorator
    },
    submissionHandler: {
      visible,
      show,
      hide,
      initialValue,
      onSubmit
    }
  }
) => (
  <React.Fragment>
    <Button type="primary" onClick={show}>
      <Icon type="plus"/> New account
    </Button>
    <Drawer
      title="Create a new account"
      width={720}
      onClose={hide}
      visible={visible}
    >
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
      <div
        style={{
          position: 'absolute',
          left: 0,
          bottom: 0,
          width: '100%',
          borderTop: '1px solid #e9e9e9',
          padding: '10px 16px',
          background: '#fff',
          textAlign: 'right',
        }}
      >
        <Button onClick={hide} style={{marginRight: 8}}>
          Cancel
        </Button>
        <Button onClick={onSubmit} type="primary">
          Submit
        </Button>
      </div>
    </Drawer>
  </React.Fragment>
);


export const AddAccountForm = Form.create()(withSubmissionHandler(AddAccountFormDrawer));

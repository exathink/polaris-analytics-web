import React from "react";

import "@ant-design/compatible/assets/index.css";
import {Checkbox, Col, Drawer, Form, Input, Row} from "antd";
import Button from "../../../../components/uielements/button";
import {StripeTable} from "../../../components/tables/tableUtils";

export const EditUserForm = ({initialValues, onSubmit}) => {
  const [visible, setVisible] = React.useState(false);
  function onClose() {
    setVisible(false);
  }

  const dataSource = initialValues.organizationRoles.map((org) => {
    return {
      key: org.scopeKey,
      name: org.name,
      role: org.role,
    };
  });

  const columns = [
    {
      title: "Organization Name",
      dataIndex: "name",
      key: "name",
      width: "30%",
    },
    {
      title: "Is Owner",
      dataIndex: "role",
      key: "role",
      width: "70%",
      render: (text, record) => {
        return (
          <Form.Item
            name={record.name}
            initialValue={record.role === "owner"}
            valuePropName="checked"
            className="!tw-mb-0"
          >
            <Checkbox className="!tw-min-h-[16px]"></Checkbox>
          </Form.Item>
        );
      },
    },
  ];

  return (
    <div>
      <Button type="primary" onClick={() => setVisible(true)}>
        Edit
      </Button>
      <Drawer title={"Edit User"} width={720} onClose={onClose} visible={visible}>
        <Form key={visible} layout="vertical" hideRequiredMark onFinish={onSubmit} initialValues={initialValues}>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                label="Email"
                name={"email"}
                rules={[
                  {type: "email", message: "The input is not a valid email"},
                  {required: true, message: "Email is required"},
                ]}
              >
                <Input placeholder="email" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                name={"firstName"}
                label="First name"
                rules={[{required: true, message: "First name is required"}]}
              >
                <Input placeholder="first name" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                name={"lastName"}
                label="Last name"
                rules={[{required: true, message: "Last name is required"}]}
              >
                <Input placeholder="last name" />
              </Form.Item>
            </Col>
            {initialValues.role && (
              <Col span={24}>
                <Form.Item name={"role"} label="Roles and Access" valuePropName="checked">
                  <Checkbox defaultChecked={initialValues.role}>Account Owner</Checkbox>
                </Form.Item>
              </Col>
            )}
            <Col span={24}>
              <div className="tw-text-base">Roles Assigned to all organizations belonging to this User</div>
              <StripeTable dataSource={dataSource} columns={columns} pagination={false} size="small" />
            </Col>
          </Row>

          <div
            className="tw-absolute tw-left-0 tw-bottom-0 tw-w-full tw-bg-white tw-py-4 tw-px-4 tw-text-right"
            style={{borderTop: "1px solid #e9e9e9"}}
          >
            <Button onClick={onClose} style={{marginRight: 8}}>
              Cancel
            </Button>

            <Button htmlType="submit" type="primary">
              Save
            </Button>
          </div>
        </Form>
      </Drawer>
    </div>
  );
};

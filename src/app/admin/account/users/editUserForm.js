import React from "react";

import "@ant-design/compatible/assets/index.css";
import {Checkbox, Col, Drawer, Form, Input, Row, Select} from "antd";
import Button from "../../../../components/uielements/button";
const {Option} = Select;

const ALL_ORG_ROLES = [
  {key: "owner", name: "Owner"},
  {key: "member", name: "Member"},
];

export const EditUserForm = ({initialValues, onSubmit}) => {
  const [visible, setVisible] = React.useState(false);
  function onClose() {
    setVisible(false);
  }

  return (
    <div>
      <Button type="primary" onClick={() => setVisible(true)}>
        Edit
      </Button>
      <Drawer key={visible} title={"Edit User"} width={720} onClose={onClose} visible={visible}>
        <Form layout="vertical" hideRequiredMark onFinish={onSubmit} initialValues={initialValues}>
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
              {initialValues.organizationRoles.map((org) => {
                return (
                  <Form.Item name={org.organizationKey} label={org.organizationName} key={org.organizationKey}>
                    <Select style={{width: 150}} defaultValue={initialValues[org.organizationKey]}>
                      {ALL_ORG_ROLES.map((a) => {
                        return (
                          <Option key={a.key} value={a.key}>
                            {a.name}
                          </Option>
                        );
                      })}
                    </Select>
                  </Form.Item>
                );
              })}
            </Col>
          </Row>

          <div
            style={{
              position: "absolute",
              left: 0,
              bottom: 0,
              width: "100%",
              borderTop: "1px solid #e9e9e9",
              padding: "10px 16px",
              background: "#fff",
              textAlign: "right",
            }}
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

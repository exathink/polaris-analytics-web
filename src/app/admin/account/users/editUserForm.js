import React from "react";

import "@ant-design/compatible/assets/index.css";
import {Checkbox, Col, Drawer, Form, Input, Row, Select} from "antd";
import {withViewerContext} from "../../../framework/viewer/viewerContext";
import Button from "../../../../components/uielements/button";

const {Option} = Select;
function isAccountOwner(owner) {
  return true;
}
export const EditUserForm = withViewerContext(
  ({initialValues, onSubmit, viewerContext: {viewer, getViewerOrganizations}}) => {
    const organizations = getViewerOrganizations("owner");
    const [visible, setVisible] = React.useState(false);
    function onClose() {
      setVisible(false);
    }

    return (
      <div>
        <Button type="primary" onClick={() => setVisible(true)}>
          Edit
        </Button>
        <Drawer title={"Edit User"} width={720} onClose={onClose} visible={visible}>
          <Form layout="vertical" hideRequiredMark onSubmit={onSubmit} initialValues={initialValues}>
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
              <Col span={24}>
                <Form.Item name={"role"} label="Roles and Access">
                  <Checkbox>Account Owner</Checkbox>
                </Form.Item>
              </Col>
              <Col span={24}>
                {organizations.map((organization) => {
                  return <div key={organization.key}>{organization.name}</div>;
                })}
              </Col>
            </Row>
          </Form>
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

            <Button onClick={onSubmit} type="primary">
              Save
            </Button>
          </div>
        </Drawer>
      </div>
    );
  }
);

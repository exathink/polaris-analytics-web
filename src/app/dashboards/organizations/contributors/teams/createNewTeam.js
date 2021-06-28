import React from "react";
import {Form} from "@ant-design/compatible";
import "@ant-design/compatible/assets/index.css";
import {Col, Input, Row} from "antd";

import {createForm} from "../../../../components/forms/createForm";
import {withSubmissionCache} from "../../../../components/forms/withSubmissionCache";
import {useCreateTeam} from "./useCreateTeam";
import {openNotification, display_error} from "../../../../helpers/utility";

const CreateNewTeam = ({currentValue, onSubmit, form: {getFieldDecorator}}) => {
  return (
    <Form layout="vertical" hideRequiredMark onSubmit={onSubmit}>
      <Row gutter={16}>
        <Col span={24}>
          <Form.Item label="Team Name">
            {getFieldDecorator("newTeam", {
              rules: [{required: true, message: "New Team is required"}],
              initialValue: currentValue("newTeam", null),
            })(<Input />)}
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

const CreateNewTeamForm = createForm(CreateNewTeam, {
  drawer: true,
  title: "Create New Team",
  submitTitle: "Create",
});

export const CreateNewTeamWidget = withSubmissionCache(
  ({submissionCache: {submit, lastSubmission}, organizationKey}) => {
    const [mutate, {loading, client, error}] = useCreateTeam({
      onCompleted: ({createTeam}) => {
        if (createTeam.success) {
          client.resetStore();
          openNotification("success", `Team ${createTeam.team.name} Created`);
        } else {
          openNotification("error", `${display_error(createTeam.errorMessage)}`);
        }
      },
      onError: (error) => {},
    });

    return (
      <CreateNewTeamForm
        onSubmit={submit((values) => {
          mutate({
            variables: {
              organizationKey: organizationKey,
              name: values.newTeam,
            },
          });
        })}
        loading={loading}
        error={error}
        values={lastSubmission}
      />
    );
  }
);

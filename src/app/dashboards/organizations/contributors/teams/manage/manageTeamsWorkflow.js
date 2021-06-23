import {Steps} from "antd";
import React from "react";
import styles from "./teams.module.css";
import {UpdateTeamsPage} from "./updateTeamsPage";
import {SelectTeamMembersPage} from "./selectTeamMembersPage";
import {teamsReducer} from "./teamsReducer";

const {Step} = Steps;

const initialState = {
  current: 0,
  selectedRecords: [],
};

export function ManageTeamsWorkflow({organizationKey, context, intl}) {
  const [state, dispatch] = React.useReducer(teamsReducer, initialState);

  const pageComponentProps = {
    organizationKey,
    context,
    intl,
    ...state,
    dispatch,
  };

  let steps = [
    {
      title: "Select Team Members",
      content: <SelectTeamMembersPage {...pageComponentProps} />,
    },
    {
      title: "Update Teams",
      content: <UpdateTeamsPage {...pageComponentProps} />,
    },
  ];

  const {current} = state;
  return (
    <div className={styles.manageTeamsWrapper}>
      <div className={styles.manageTeamsStepsWrapper}>
        <Steps current={current}>
          {steps.map((item) => (
            <Step key={item.title} title={item.title} />
          ))}
        </Steps>
      </div>
      <div className={styles.manageTeamsStepsContent}>{steps[current].content}</div>
    </div>
  );
}

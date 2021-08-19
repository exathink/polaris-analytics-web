import {Steps} from "antd";
import React from "react";
import styles from "./teams.module.css";
import {UpdateTeamsPage} from "./updateTeamsPage";
import {SelectTeamMembersPage} from "./selectTeamMembersPage";
import {teamsReducer} from "./teamsReducer";
import {ACTIVE_WITHIN_DAYS} from "../utils";
import {BackArrowIcon, CheckCircleStepIcon} from "../../../../../components/misc/customIcons";
import {actionTypes} from "./constants";

const {Step} = Steps;

const initialState = {
  commitWithinDays: ACTIVE_WITHIN_DAYS,
  current: 0,
  selectedRecords: [],
};

export function ManageTeamsWorkflow({organizationKey, teamsList, context, intl}) {
  const [state, dispatch] = React.useReducer(teamsReducer, initialState);

  const pageComponentProps = {
    organizationKey,
    context,
    intl,
    ...state,
    dispatch,
  };

  const steps = [
    {
      title: "Select Team Members",
      content: <SelectTeamMembersPage {...pageComponentProps} />,
    },
    {
      title: "Update Teams",
      content: <UpdateTeamsPage {...pageComponentProps} teamsList={teamsList} />,
    },
  ];

  const handleBackClick = () => {
    dispatch({type: actionTypes.UPDATE_CURRENT_STEP, payload: current - 1});
  };

  const {current} = state;
  return (
    <div className={styles.manageTeamsWrapper}>
      {current > 0 && (
        <div className={styles.updateTeamsBackAction}>
          <BackArrowIcon onClick={handleBackClick} />
        </div>
      )}
      <div className={styles.manageTeamsStepsWrapper}>
        <Steps current={current}>
          {steps.map((item, index) => (
            <Step key={item.title} title={item.title} icon={<CheckCircleStepIcon index={index} current={current} />} />
          ))}
        </Steps>
      </div>
      <div className={styles.manageTeamsStepsContent}>{steps[current].content}</div>
    </div>
  );
}

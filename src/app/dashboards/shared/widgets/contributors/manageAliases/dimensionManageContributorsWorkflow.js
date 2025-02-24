import {Steps} from "antd";
import React from "react";
import styles from "./contributors.module.css";
import {UpdateContributorPage} from "./updateContributorPage";
import {SelectParentContributorPage} from "./selectParentContributorPage";
import {SelectContributorsPage} from "./selectContributorsPage";
import {contributorsReducer} from "./contributorsReducer";
import {ACTIVE_WITHIN_DAYS, withNoChildren} from "./utils";
import {BackArrowIcon, CheckCircleStepIcon} from "../../../../../components/misc/customIcons";
import {actionTypes} from "./constants";

const {Step} = Steps;

const initialState = {
  commitWithinDays: ACTIVE_WITHIN_DAYS,
  current: 0,
  selectedRecords: [],
  parentContributorKey: "",
};

export function DimensionManageContributorsWorkflow({dimension, instanceKey, context, intl}) {
  const [state, dispatch] = React.useReducer(contributorsReducer, initialState);

  const pageComponentProps = {
    dimension,
    instanceKey,
    context,
    intl,
    ...state,
    dispatch,
  };

  let steps = [
    {
      title: "Select Contributors",
      content: <SelectContributorsPage {...pageComponentProps} />,
    },
    {
      title: "Update Contributor",
      content: <UpdateContributorPage {...pageComponentProps} />,
    },
  ];

  if (state.selectedRecords.length > 1 && state.selectedRecords.every(withNoChildren)) {
    const [selectContributorsStep, updateContributorStep] = steps;
    const selectParentContributorStep = {
      title: "Select Merge Target",
      content: <SelectParentContributorPage {...pageComponentProps} />,
    };

    steps = [selectContributorsStep, selectParentContributorStep, updateContributorStep];
  }

  const handleBackClick = () => {
    dispatch({type: actionTypes.UPDATE_CURRENT_STEP, payload: current - 1});
  };

  const {current} = state;
  return (
    <div className={styles.manageContributorsWrapper}>
      {current > 0 && (
        <div className={styles.contributorBackAction}>
          <BackArrowIcon onClick={handleBackClick} />
        </div>
      )}
      <div className={styles.manageContributorsStepsWrapper}>
        <Steps current={current}>
          {steps.map((item, index) => (
            <Step key={item.title} title={item.title} icon={<CheckCircleStepIcon index={index} current={current} />} />
          ))}
        </Steps>
      </div>
      <div className={styles.manageContributorsStepsContent}>{steps[current].content}</div>
    </div>
  );
}

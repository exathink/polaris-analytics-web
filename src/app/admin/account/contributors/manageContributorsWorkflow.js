import {Steps} from "antd";
import React from "react";
import styles from "./contributors.module.css";
import {UpdateContributorPage} from "./updateContributorPage";
import {SelectParentContributorPage} from "./selectParentContributorPage";
import {SelectContributorsPage} from "./selectContributorsPage";
import {contributorsReducer} from "./contributorsReducer";
import {ACTIVE_WITHIN_DAYS, withNoChildren} from "./utils";

const {Step} = Steps;

const initialState = {
  commitWithinDays: ACTIVE_WITHIN_DAYS,
  current: 0,
  selectedRecords: [],
  parentContributorKey: "",
};

export function ManageContributorsWorkflow({accountKey, context, intl}) {
  const [state, dispatch] = React.useReducer(contributorsReducer, initialState);

  const pageComponentProps = {
    accountKey,
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
      title: "Select Parent Contributor",
      content: <SelectParentContributorPage {...pageComponentProps} />,
    };

    steps = [selectContributorsStep, selectParentContributorStep, updateContributorStep];
  }

  const {current} = state;
  return (
    <div className={styles.updateContributorWrapper}>
      <div className={styles.updateContributorStepsWrapper}>
        <Steps current={current}>
          {steps.map((item) => (
            <Step key={item.title} title={item.title} />
          ))}
        </Steps>
      </div>
      <div className={styles.updateContributorStepsContent}>{steps[current].content}</div>
    </div>
  );
}

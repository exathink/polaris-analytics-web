import {Steps} from "antd";
import React from "react";
import styles from "./contributors.module.css";
import {MergeContributorsPage} from "./mergeContributorsPage";
import {SelectParentContributorPage} from "./selectParentContributorPage";
import {SelectContributorsPage} from "./selectContributorsPage";
import {contributorsReducer} from "./contributorsReducer";

const {Step} = Steps;

const initialState = {
  commitWithinDays: 60,
  current: 0,
  selectedRecords: [],
  parentContributorKey: "",
};

export function MergeContributorsWorkflow({accountKey, context, intl}) {
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
      title: "Merge Contributors",
      content: <MergeContributorsPage {...pageComponentProps} />,
    },
  ];

  if (state.selectedRecords.every((x) => x.contributorAliasesInfo == null)) {
    const [selectContributorsStep, mergeContributorsStep] = steps;
    const selectParentContributorStep = {
      title: "Select Parent Contributor",
      content: <SelectParentContributorPage {...pageComponentProps} />,
    };

    steps = [selectContributorsStep, selectParentContributorStep, mergeContributorsStep];
  }

  const {current} = state;
  return (
    <div className={styles.mergeContributorsWrapper}>
      <div className={styles.mergeContributorsStepsWrapper}>
        <Steps current={current}>
          {steps.map((item) => (
            <Step key={item.title} title={item.title} />
          ))}
        </Steps>
      </div>
      <div className={styles.mergeContributorsStepsContent}>{steps[current].content}</div>
    </div>
  );
}

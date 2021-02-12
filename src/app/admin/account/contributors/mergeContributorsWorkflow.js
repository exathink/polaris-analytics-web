import {Steps, Button} from "antd";
import React from "react";
import styles from "./contributors.module.css";
import {MergeContributorsPage} from "./mergeContributorsPage";
import {SelectParentContributorPage} from "./selectParentContributorPage";
import {SelectContributorsPage} from "./selectContributorsPage";
import {actionTypes} from "./constants";
import {contributorsReducer} from "./contributorsReducer"

const {Step} = Steps;

function getParentContributor(initSelectedRecords, parentContributorKey) {
  const recordWithChildren = initSelectedRecords.find((x) => x.contributorAliasesInfo != null);
  if (recordWithChildren == null) {
    return initSelectedRecords.find((x) => x.key === parentContributorKey);
  }
  return recordWithChildren;
}

const initialState = {
  commitWithinDays: 60,
  current: 0,
  selectedRecords: [],
  parentContributorKey: "",
};

export function MergeContributorsWorkflow({accountKey, context, intl}) {
  const [state, dispatch] = React.useReducer(contributorsReducer, initialState);

  const {commitWithinDays, current, selectedRecords, parentContributorKey} = state;

  const setSelectedRecords = (records) => {
    dispatch({type: actionTypes.UPDATE_SELECTED_RECORDS, payload: records});
  };

  const setParentContributorKey = (parentKey) => {
    dispatch({type: actionTypes.UPDATE_PARENT_CONTRIBUTOR_KEY, payload: parentKey});
  };

  const setCommitWithinDays = (days) => {
    dispatch({type: actionTypes.UPDATE_DAYS, payload: days});
  };

  const handleNextClick = () => {
    dispatch({type: actionTypes.UPDATE_CURRENT_STEP, payload: current + 1});
  };

  const handleBackClick = () => {
    dispatch({type: actionTypes.UPDATE_CURRENT_STEP, payload: current - 1});
  };

  const handleDoneClick = () => {
    context.go("..");
  };

  const sliderState = [commitWithinDays, setCommitWithinDays];

  function actionButtonsForSelectContributorsPage({isNextButtonDisabled}) {
    const nextButtonDisabled = isNextButtonDisabled || current === steps.length - 1;

    return (
      <>
        <div className={styles.selectContributorsNextAction}>
          <Button
            type="primary"
            className={styles.contributorsButton}
            style={!nextButtonDisabled ? {backgroundColor: "#7824b5", borderColor: "#7824b5", color: "white"} : {}}
            onClick={handleNextClick}
            disabled={nextButtonDisabled}
          >
            Next
          </Button>
        </div>
        <div className={styles.selectContributorsDoneAction}>
          <Button
            className={styles.contributorsButton}
            style={{backgroundColor: "#7824b5", borderColor: "#7824b5", color: "white"}}
            onClick={handleDoneClick}
          >
            Done
          </Button>
        </div>
      </>
    );
  }

  function actionButtonsForMergeContributors({isNextButtonDisabled, actionButtonHandler}) {
    const mergeButtonDisabled = isNextButtonDisabled;

    return (
      <>
        <div className={styles.mergeContributorsMergeAction}>
          <Button
            type="primary"
            className={styles.contributorsButton}
            style={!mergeButtonDisabled ? {backgroundColor: "#7824b5", borderColor: "#7824b5", color: "white"} : {}}
            onClick={actionButtonHandler}
            disabled={mergeButtonDisabled}
          >
            Merge Contributors
          </Button>
        </div>
        <div className={styles.mergeContributorsBackAction}>
          <Button
            className={styles.contributorsButton}
            style={{backgroundColor: "#7824b5", borderColor: "#7824b5", color: "white"}}
            onClick={handleBackClick}
          >
            Back
          </Button>
        </div>
        <div className={styles.mergeContributorsDoneAction}>
          <Button
            className={styles.contributorsButton}
            style={{backgroundColor: "#7824b5", borderColor: "#7824b5", color: "white"}}
            onClick={handleDoneClick}
          >
            Done
          </Button>
        </div>
      </>
    );
  }

  function actionButtonsForSelectParentContributor() {
    const nextButtonDisabled = parentContributorKey.trim() === "";

    return (
      <>
        <div className={styles.parentContributorNextAction}>
          <Button
            type="primary"
            className={styles.contributorsButton}
            style={!nextButtonDisabled ? {backgroundColor: "#7824b5", borderColor: "#7824b5", color: "white"} : {}}
            onClick={handleNextClick}
            disabled={nextButtonDisabled}
          >
            Next
          </Button>
        </div>
        <div className={styles.parentContributorBackAction}>
          <Button
            className={styles.contributorsButton}
            style={{backgroundColor: "#7824b5", borderColor: "#7824b5", color: "white"}}
            onClick={handleBackClick}
          >
            Back
          </Button>
        </div>
        <div className={styles.parentContributorDoneAction}>
          <Button
            className={styles.contributorsButton}
            style={{backgroundColor: "#7824b5", borderColor: "#7824b5", color: "white"}}
            onClick={handleDoneClick}
          >
            Done
          </Button>
        </div>
      </>
    );
  }

  const selectedRecordsWithoutChildren = selectedRecords
    .filter((x) => x.contributorAliasesInfo == null)
    .filter((x) => x.key !== parentContributorKey);

  const pageComponentProps = {
    accountKey,
    context,
    intl,
  };

  let steps = [
    {
      title: "Select Contributors",
      content: (
        <SelectContributorsPage
          {...pageComponentProps}
          sliderState={sliderState}
          selectContributorsState={[selectedRecords, setSelectedRecords]}
          renderActionButtons={actionButtonsForSelectContributorsPage}
        />
      ),
    },
    {
      title: "Merge Contributors",
      content: (
        <MergeContributorsPage
          {...pageComponentProps}
          parentContributor={getParentContributor(selectedRecords, parentContributorKey)}
          selectedRecordsWithoutChildren={selectedRecordsWithoutChildren}
          renderActionButtons={actionButtonsForMergeContributors}
        />
      ),
    },
  ];

  if (selectedRecords.every((x) => x.contributorAliasesInfo == null)) {
    const [selectContributorsStep, mergeContributorsStep] = steps;
    const selectParentContributorStep = {
      title: "Select Parent Contributor",
      content: (
        <SelectParentContributorPage
          {...pageComponentProps}
          selectParentContributorState={[parentContributorKey, setParentContributorKey]}
          selectedRecords={selectedRecords}
          renderActionButtons={actionButtonsForSelectParentContributor}
        />
      ),
    };

    steps = [selectContributorsStep, selectParentContributorStep, mergeContributorsStep];
  }

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

import {Steps, Button} from "antd";
import React from "react";
import styles from "./contributors.module.css";
import {MergeContributorsPage} from "./mergeContributorsPage";
import {SelectParentContributorsPage} from "./selectParentContributorPage";
import {SelectContributorsPage} from "./selectContributorsPage";

const {Step} = Steps;

function getParentContributor(initSelectedRecords, parentContributorKey) {
  const recordWithChildren = initSelectedRecords.find((x) => x.contributorAliasesInfo != null);
  if (recordWithChildren == null) {
    return initSelectedRecords.find((x) => x.key === parentContributorKey);
  }
  return recordWithChildren;
}

export function MergeContributorsWorkflow({accountKey, context, intl}) {
  const [current, setCurrent] = React.useState(0);
  const [selectedRecords, setSelectedRecords] = React.useState([]);
  const [parentContributorKey, setParentContributorKey] = React.useState("");

  const handleNextClick = () => {
    setCurrent(current + 1);
  };

  const handleDoneClick = () => {
    context.go("..");
  };

  function renderActionButtons(isNextButtonDisabled) {
    const nextButtonDisabled = isNextButtonDisabled || current === steps.length - 1;
    const prevButtonDisabled = current === 0;

    return (
      <>
        <div className={styles.mergeContributorsNextAction}>
          <Button
            type="primary"
            className={styles.mergeContributorsButton}
            style={!nextButtonDisabled ? {backgroundColor: "#7824b5", borderColor: "#7824b5", color: "white"} : {}}
            onClick={handleNextClick}
            disabled={nextButtonDisabled}
          >
            Next
          </Button>
        </div>
        <div className={styles.mergeContributorsPrevAction}>
          <Button
            className={styles.mergeContributorsButton}
            style={!prevButtonDisabled ? {backgroundColor: "#7824b5", borderColor: "#7824b5", color: "white"} : {}}
            onClick={handleDoneClick}
            disabled={prevButtonDisabled}
          >
            Done
          </Button>
        </div>
      </>
    );
  }

  const pageComponentProps = {
    accountKey,
    context,
    intl,
    renderActionButtons,
  };

  const selectedRecordsWithoutChildren = selectedRecords
    .filter((x) => x.contributorAliasesInfo == null)
    .filter((x) => x.key !== parentContributorKey);

  let steps = [
    {
      title: "Select Contributors",
      content: (
        <SelectContributorsPage
          {...pageComponentProps}
          selectContributorsState={[selectedRecords, setSelectedRecords]}
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
        />
      ),
    },
  ];

  if (selectedRecords.every((x) => x.contributorAliasesInfo == null)) {
    const [selectContributorsStep, mergeContributorsStep] = steps;
    const selectParentContributorStep = {
      title: "Select Parent Contributor",
      content: (
        <SelectParentContributorsPage
          {...pageComponentProps}
          selectParentContributorState={[parentContributorKey, setParentContributorKey]}
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

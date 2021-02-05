import {Steps, Button} from "antd";
import React from "react";
import styles from "./contributors.module.css";
import MergeContributorsPage from "./mergeContributorsPage";
import SelectContributorsPage from "./selectContributorsPage";

const {Step} = Steps;

export function MergeContributorsWorkflow() {
  const [current, setCurrent] = React.useState(0);

  const handleNextClick = () => {
    setCurrent(current + 1);
  };

  const handlePrevClick = () => {
    setCurrent(current - 1);
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
            onClick={handlePrevClick}
            disabled={prevButtonDisabled}
          >
            Previous
          </Button>
        </div>
      </>
    );
  }

  const steps = [
    {
      title: "Select Contributors",
      content: <SelectContributorsPage renderActionButtons={renderActionButtons} />,
    },
    {
      title: "Merge Contributors",
      content: <MergeContributorsPage renderActionButtons={renderActionButtons} />,
    },
  ];

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

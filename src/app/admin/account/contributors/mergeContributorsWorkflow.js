import {Steps, Button} from "antd";
import React from "react";
import styles from "./contributors.module.css";
import {MergeContributorsPage} from "./mergeContributorsPage";
import {SelectContributorsPage} from "./selectContributorsPage";

const {Step} = Steps;

const getSteps = (accountKey) => [
  {
    title: "Select Contributors",
    content: <SelectContributorsPage accountKey={accountKey} />,
  },
  {
    title: "Merge Contributors",
    content: <MergeContributorsPage />,
  },
];

export function MergeContributorsWorkflow({accountKey}) {
  const [current, setCurrent] = React.useState(0);

  const next = () => {
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  const steps = getSteps(accountKey);

  const nextButtonDisabled = current === steps.length - 1;
  const prevButtonDisabled = current === 0;
  return (
    <div className={styles.mergeContributorsWrapper}>
      <div className={styles.mergeContributorsStepsWrapper}>
        <Steps current={current}>
          {steps.map((item) => (
            <Step key={item.title} title={item.title} />
          ))}
        </Steps>
      </div>
      <div className={styles.mergeContributorsNextAction}>
        <Button type="primary" className={styles.mergeContributorsButton} style={!nextButtonDisabled ? {backgroundColor: '#7824b5', borderColor: '#7824b5', color: 'white'} : {}} onClick={() => next()} disabled={nextButtonDisabled}>
          Next
        </Button>
      </div>
      <div className={styles.mergeContributorsPrevAction}>
        <Button className={styles.mergeContributorsButton} style={!prevButtonDisabled ? {backgroundColor: '#7824b5', borderColor: '#7824b5', color: 'white'} : {}} onClick={() => prev()} disabled={prevButtonDisabled}>
          Previous
        </Button>
      </div>
      <div className={styles.mergeContributorsStepsContent}>{steps[current].content}</div>
    </div>
  );
}

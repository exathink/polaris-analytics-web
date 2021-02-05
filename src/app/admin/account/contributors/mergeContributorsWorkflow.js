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
      <div className={styles.mergeContributorsNextAction}>
        <Button type="primary" onClick={() => next()} disabled={current === steps.length - 1}>
          Next
        </Button>
      </div>
      <div className={styles.mergeContributorsPrevAction}>
        <Button style={{margin: "0 8px"}} onClick={() => prev()} disabled={current === 0}>
          Previous
        </Button>
      </div>
    </div>
  );
}

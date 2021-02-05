import {Steps, Button} from "antd";
import React from "react";
import "./contributors.css";
import {MergeContributorsPage} from "./mergeContributorsPage";
import {SelectContributorsPage} from "./selectContributorsPage";

const {Step} = Steps;

const getSteps = (accountKey) => [
  {
    title: "Select Contributors",
    content: <SelectContributorsPage accountKey={accountKey}/>,
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
    <div className="mergeContributorsWrapper">
      <div className="mergeContributorsStepsWrapper">
        <Steps current={current}>
          {steps.map((item) => (
            <Step key={item.title} title={item.title} />
          ))}
        </Steps>
      </div>
      <div className="mergeContributorsStepsContent">{steps[current].content}</div>
      <div className="mergeContributorsNextAction">
        <Button type="primary" onClick={() => next()} disabled={current === steps.length - 1}>
          Next
        </Button>
      </div>
      <div className="mergeContributorsPrevAction">
        <Button style={{margin: "0 8px"}} onClick={() => prev()} disabled={current === 0}>
          Previous
        </Button>
      </div>
    </div>
  );
}

import {Steps, message, Button} from "antd";
import React from "react";
import "./contributors.css";

const {Step} = Steps;

const steps = [
  {
    title: "Select Aliases",
    content: "Select Aliases",
  },
  {
    title: "Merge Contributors",
    content: "Select Contributor",
  },
  {
    title: "Edit Contributors",
    content: "Edit Contributor",
  },
];

export function MergeContributorsWorkflow({}) {
  const [current, setCurrent] = React.useState(0);

  const next = () => {
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };

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
      <div className="mergeContributorsStepsAction">
        {current < steps.length - 1 && (
          <Button type="primary" onClick={() => next()}>
            Next
          </Button>
        )}
        {current === steps.length - 1 && (
          <Button type="primary" onClick={() => message.success("Processing complete!")}>
            Done
          </Button>
        )}
        {current > 0 && (
          <Button style={{margin: "0 8px"}} onClick={() => prev()}>
            Previous
          </Button>
        )}
      </div>
    </div>
  );
}

import React from 'react';
import {Steps} from "antd";
import './steps.css';
import styles from "./workflowView.module.css";
import {CheckCircleStepIcon} from "../misc/customIcons";

const {Step} = Steps;

export const WorkflowView = ({title, steps, current, renderNavigationControls, stepProps}) => {
  const currentStep = steps[current];

  return (
    <div className={styles.workflowViewWrapper}>
      <div className={styles.stepsWrapper}>
        <h2>{title}</h2>
        <Steps current={current}>
          {steps.map((item, index) => (
            <Step key={index}
                  style={index > current ? {} : {}}
                  title={item.title}
                  icon={<CheckCircleStepIcon index={index} current={current} />}
            />
          ))}
        </Steps>

      </div>
      <div className={styles.stepsContent}>
        {
          React.createElement(steps[current].content, stepProps)
        }
      </div>
      <div className={styles.stepsAction}>
        {
          React.createElement(renderNavigationControls, {current, currentStep})
        }
      </div>
    </div>
  )
}
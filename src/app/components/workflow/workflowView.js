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
      <div className={styles.backButton}>{renderNavigationControls().backButton()}</div>
      <div className={styles.stepsWrapper}>
        <Steps current={current}>
          {steps.map((item, index) => (
            <Step
              key={index}
              title={item.title}
              icon={<CheckCircleStepIcon index={index} current={current} />}
            />
          ))}
        </Steps>
        <h2 className={styles.workflowTitle}>{title}</h2>
      </div>
      <div className={styles.stepsContent}>{React.createElement(steps[current].content, stepProps)}</div>
      <div className={styles.stepsAction}>
        <div className={styles.doneButton}>{renderNavigationControls().doneButton()}</div>
        <div className={styles.nextButton}>{renderNavigationControls().nextButton()}</div>
      </div>
    </div>
  );
}
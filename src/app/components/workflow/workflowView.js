import React from 'react';
import {Flex} from "reflexbox";
import {Steps} from "antd";
import './steps.css';
import {CheckCircleStepIcon} from "../misc/customIcons";

const {Step} = Steps;

export const WorkflowView = ({title, steps, current, renderNavigationControls, stepProps}) => {
  const currentStep = steps[current];

  return (
    <Flex column style={{height: "100%", width: "100%"}}>
      <Flex column h={0.15}>
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

      </Flex>
      <Flex h={0.10} justify='center' pt={'10px'} className="steps-action">
        {
          React.createElement(renderNavigationControls, {current, currentStep})
        }
      </Flex>
      <Flex column h={0.75} className="steps-content">
        {
          React.createElement(steps[current].content, stepProps)
        }
      </Flex>
    </Flex>
  )
}
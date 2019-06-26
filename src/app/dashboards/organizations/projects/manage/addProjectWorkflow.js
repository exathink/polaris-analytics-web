import React from 'react';
import './steps.css';
import {message, Steps} from 'antd';
import Button from "../../../../../components/uielements/button";
import {SelectConnectorStep} from "./selectConnectorStep";
import {SelectProjectsStep} from "./selectProjectsStep";
import {ImportProjectStep} from "./importProjectStep";


const {Step} = Steps;

const steps = [
  {
    title: 'Select Connector',
    content: SelectConnectorStep,
    showNext: false
  },
  {
    title: 'Select Projects',
    content: SelectProjectsStep,
    showNext: true,
    disableNextIf: ({selectedProjects}) => selectedProjects.length == 0
  },
  {
    title: 'Configure Import',
    content: ImportProjectStep,
  },
  {
    title: 'Import Projects',
    content: () => 'import'
  },
];


export class AddProjectWorkflow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      current: 0,
      selectedConnector: {},
      selectedProjects: [],
    };
  }

  next() {
    const current = this.state.current + 1;
    this.setState({current});
  }

  prev() {
    const current = this.state.current - 1;
    this.setState({current});
  }


  onConnectorSelected(connector) {
    this.setState({
      current: 1,
      selectedConnector: connector,
      selectedProjects: this.state.selectedConnector.key !== connector.key ? [] : this.state.selectedProjects
    })
  }

  onProjectsSelected(selectedProjects) {
    this.setState({
      selectedProjects: selectedProjects
    })
  }

  render() {
    const {current} = this.state;
    const currentStep = steps[current];
    const disableNext = currentStep.disableNextIf && currentStep.disableNextIf(this.state)
    return (
      <React.Fragment>
        <Steps current={current}>
          {steps.map(item => (
            <Step key={item.title} title={item.title}/>
          ))}
        </Steps>
        <div className="steps-content">
          {
            React.createElement(steps[current].content, {
                onConnectorSelected: this.onConnectorSelected.bind(this),
                selectedConnector: this.state.selectedConnector,
                onProjectsSelected: this.onProjectsSelected.bind(this),
                selectedProjects: this.state.selectedProjects
              }
            )
          }
        </div>

        <div className="steps-action">
          {current > 0 && (
            <Button type="primary" style={{marginLeft: 8}} onClick={() => this.prev()}>
              Back
            </Button>
          )}
          {currentStep.showNext && current < steps.length - 1 && (
            <Button type="primary" onClick={() => this.next()} disabled={disableNext}>
              Next
            </Button>
          )}
          {current === steps.length - 1 && (
            <Button type="primary" onClick={() => message.success('Processing complete!')}>
              Done
            </Button>
          )}

        </div>
      </React.Fragment>
    );
  }
}


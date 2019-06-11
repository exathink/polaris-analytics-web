import React from 'react';
import './steps.css';
import {Button, message, Steps} from 'antd';
import {SelectConnectorStep} from "./selectConnectorStep";


const {Step} = Steps;

const steps = [
  {
    title: 'Select Connector',
    content: SelectConnectorStep,
    showNext: false
  },
  {
    title: 'Select Projects To Import',
    content: () => 'Second-content',
  },
  {
    title: 'Create Projects',
    content: () => 'Last-content',
  },
];


export class AddProjectWorkflow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      current: 0,
      selectedConnector: null
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
      selectedConnector: connector
    })
  }

  render() {
    const {current} = this.state;
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
              onConnectorSelected: this.onConnectorSelected.bind(this)
            })
          }
        </div>

        <div className="steps-action">
          {steps[current].showNext && current < steps.length - 1 && (
            <Button type="primary" onClick={() => this.next()}>
              Next
            </Button>
          )}
          {current === steps.length - 1 && (
            <Button type="primary" onClick={() => message.success('Processing complete!')}>
              Done
            </Button>
          )}
          {current > 0 && (
            <Button type="primary" style={{marginLeft: 8}} onClick={() => this.prev()}>
              Back
            </Button>
          )}
        </div>
      </React.Fragment>
    );
  }
}


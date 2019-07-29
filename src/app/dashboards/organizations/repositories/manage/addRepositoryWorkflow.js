import React from 'react';
import {Steps} from 'antd';
import Button from "../../../../../components/uielements/button";
import {SelectConnectorStep} from "./selectConnectorStep";
import {SelectRepositoriesStep} from "./selectRepositoriesStep";
import {ShowImportStateStep} from "./showImportStateStep";
import {withNavigationContext} from "../../../../framework/navigation/components/withNavigationContext";
import './steps.css';

const {Step} = Steps;

const steps = [
    {
        title: 'Select Connector',
        content: SelectConnectorStep,
        showNext: false
      },
      {
        title: 'Select Repositories',
        content: SelectRepositoriesStep,
        showNext: true
      },
      {
        title: 'Import Repositories',
        content: ShowImportStateStep,
        showNext: false
      }
    ];

export const AddRepositoryWorkflow = withNavigationContext(
  class _AddRepositoryWorkflow extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        current: 1,
        selectedConnector: {},
      };
    }

    next() {
      const current = this.state.current + 1;
      this.setState({current});
    }

    prev() {
      const current = this.state.current < steps.length-1 ? this.state.current - 1 : 1;
      this.setState({current});
    }

    render() {
      const {current} = this.state;
      const currentStep = steps[current];
      const disableNext = currentStep.disableNextIf && currentStep.disableNextIf(this.state);
      const {context, organization} = this.props;
      return (
        <React.Fragment>
          <Steps current={current}>
            {steps.map(item => (
              <Step key={item.title} title={item.title} />
            ))}
          </Steps>
          <div className="steps-content">
            {
              React.createElement(steps[current].content, {
                organizationKey: organization.key
              }
              )
            }
          </div>

          <div className="steps-action">
            {current > 0 && (
              <Button type="primary" style={{marginLeft: 8}} onClick={() => this.prev()}>
                {current < steps.length ? 'Back' : 'Import More Repositories'}
              </Button>
            )}
            {currentStep.showNext && current < steps.length - 1 && !disableNext && (
              <Button type="primary" onClick={() => this.next()}>
                Next
            </Button>
            )}
            {(disableNext || current === steps.length - 1) && (
              <Button type="primary" onClick={() => context.go('..', 'repositories')}>
                Done
            </Button>
            )}

          </div>
        </React.Fragment>
      );
    }
  })


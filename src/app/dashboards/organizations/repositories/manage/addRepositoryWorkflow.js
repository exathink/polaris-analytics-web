import React from 'react';
import {Steps} from 'antd';
import Button from "../../../../../components/uielements/button";
import {SelectConnectorStep} from "./selectConnectorStep";
import {SelectRepositoriesStep, REFETCH_CONNECTOR_REPOSITORIES_QUERY} from "./selectRepositoriesStep";
import {ReviewImportStep} from "./reviewImportStep";
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
    showNext: true,
    disableNextIf: ({selectedRepositories}) => selectedRepositories.length == 0
  },
  {
    title: 'Review Import',
    content: ReviewImportStep,
    showNext: false
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
        current: 0,
        selectedConnector: {},
      };
    }

    next() {
      const current = this.state.current + 1;
      this.setState({current});
    }

    prev() {
      const current = this.state.current < steps.length ? this.state.current - 1 : 1;
      this.setState({current});
    }

    onConnectorSelected(connector) {
      this.setState({
        current: 1,
        selectedConnector: connector,
        selectedProjects: this.state.selectedConnector.key !== connector.key ? [] : this.state.selectedProjects
      })
    }

    onRepositoriesSelected(selectedRepositories) {
      this.setState({
        selectedRepositories: selectedRepositories
      })
    }

    getRepositoryKeys() {
      const {selectedRepositories} = this.state;
      return selectedRepositories.map(repo => repo.key)
    }

    async onDoImport() {
      const {organization, viewerContext} = this.props;
      try {
        const result = await vcs_service.mutate({
          mutation: gql`
              mutation importRepositories($importRepositoriesInput: ImportRepositoriesInput!) {
                  importRepositories(importRepositoriesInput: $importRepositoriesInput) {
                    importedRepositoryKeys
                  }
              }
          `,
          variables: {
            importRepositoriesInput: {
              organizationKey: organization.key,
              repositoryKeys: this.getRepositoryKeys()
            }
          },
          refetchQueries: (fetchData) => refetchQueries(
            [REFETCH_CONNECTOR_REPOSITORIES_QUERY],
            {...this.props, ...this.state},
            fetchData
          )
        })
        if (result.data) {
          this.setState({
            current: 3,
            importedRepositoryKeys: result.data.importRepositories.importedRepositoryKeys,
            selectedRepositories: []
          })
        }
      } catch (error) {
        console.log(`Error: ${error}`)
      }
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
                organizationKey: organization.key,
                onConnectorSelected: this.onConnectorSelected.bind(this),
                selectedConnector: this.state.selectedConnector,
              })
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


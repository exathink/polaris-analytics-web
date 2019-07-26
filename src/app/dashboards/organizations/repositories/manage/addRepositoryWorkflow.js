import React from 'react';
import gql from "graphql-tag";
import {Steps} from 'antd';
import Button from "../../../../../components/uielements/button";
import {SelectConnectorStep} from "./selectConnectorStep";
import {SelectRepositoriesStep, REFETCH_CONNECTOR_WORK_ITEMS_SOURCES_QUERY} from "./selectRepositoriesStep";
import {ConfigureImportStep} from "./configureImportStep";
import {ShowImportStateStep} from "./showImportStateStep";
import {work_tracking_service} from "../../../../services/graphql";
import {refetchQueries} from "../../../../components/graphql/utils";
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
    title: 'Configure Import',
    content: ConfigureImportStep,
  },
  {
    title: 'Import Repositories',
    content: ShowImportStateStep
  },
];

export const AddRepositoryWorkflow = withNavigationContext(
  class _AddRepositoryWorkflow extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        current: 0,
        selectedConnector: {},
        selectedRepositories: [],
        importedRepositoryKeys: [],
      };
    }

    next() {
      const current = this.state.current + 1;
      this.setState({current});
    }

    prev() {
      // if we are in the final stage, back should take us to Select Repositories
      // since we will have cleared the selected projects at that point.
      const current = this.state.current < 3 ? this.state.current - 1 : 1;
      this.setState({current});
    }

    onConnectorSelected(connector) {
      this.setState({
        current: 1,
        selectedConnector: connector,
        selectedRepositories: this.state.selectedConnector.key !== connector.key ? [] : this.state.selectedRepositories
      })
    }

    onRepositoriesSelected(selectedRepositories) {
      this.setState({
        selectedRepositories: selectedRepositories
      })
    }

    buildRepositoriesInput(importMode, selectedRepositories, importedRepositoryName, importedRepositoryKey) {
      switch (importMode) {
        case 'single':
          return [{
            importedRepositoryName: importedRepositoryName,
            workItemsSources: selectedRepositories.map(
              project => ({
                workItemsSourceName: project.name,
                workItemsSourceKey: project.key,
                importDays: project.importDays
              })
            )
          }]
        case 'existing':
          return [{
            existingRepositoryKey: importedRepositoryKey,
            workItemsSources: selectedRepositories.map(
              project => ({
                workItemsSourceName: project.name,
                workItemsSourceKey: project.key,
                importDays: project.importDays
              })
            )
          }]
        default:
          return selectedRepositories.map(
            project => ({
              importedRepositoryName: project.localName,
              workItemsSources: [
                {
                  workItemsSourceName: project.name,
                  workItemsSourceKey: project.key,
                  importDays: project.importDays
                }
              ]
            })
          )
      }
    }

    async onImportConfigured(importMode, selectedRepositories, importedRepositoryName = null, importedRepositoryKey = null) {
      const {organization, viewerContext} = this.props;

      try {
        const result = await work_tracking_service.mutate({
          mutation: gql`
            mutation importRepositories($importRepositoriesInput: ImportRepositoriesInput!) {
                importRepositories(importRepositoriesInput: $importRepositoriesInput) {
                    projectKeys
                }
            }
        `,
          variables: {
            importRepositoriesInput: {
              accountKey: viewerContext.accountKey,
              organizationKey: organization.key,
              projects: this.buildRepositoriesInput(importMode, selectedRepositories, importedRepositoryName, importedRepositoryKey)
            }
          },
          refetchQueries: (fetchData) => refetchQueries(
            [REFETCH_CONNECTOR_WORK_ITEMS_SOURCES_QUERY],
            {...this.props, ...this.state},
            fetchData
          )
        })
        if (result.data) {
          this.setState({
            current: 3,
            importedRepositoryKeys: result.data.importRepositories.projectKeys,
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
                onConnectorSelected: this.onConnectorSelected.bind(this),
                selectedConnector: this.state.selectedConnector,
                onRepositoriesSelected: this.onRepositoriesSelected.bind(this),
                selectedRepositories: this.state.selectedRepositories,
                onImportConfigured: this.onImportConfigured.bind(this),
                importedRepositoryKeys: this.state.importedRepositoryKeys,
                organizationKey: organization.key
              }
              )
            }
          </div>

          <div className="steps-action">
            {current > 0 && (
              <Button type="primary" style={{marginLeft: 8}} onClick={() => this.prev()}>
                {current < 3 ? 'Back' : 'Import More Repositories'}
              </Button>
            )}
            {currentStep.showNext && current < steps.length - 1 && !disableNext && (
              <Button type="primary" onClick={() => this.next()}>
                Next
            </Button>
            )}
            {(disableNext || current === steps.length - 1) && (
              <Button type="primary" onClick={() => context.go('..', 'projects')}>
                Done
            </Button>
            )}

          </div>
        </React.Fragment>
      );
    }
  })


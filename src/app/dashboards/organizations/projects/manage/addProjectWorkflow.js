import React from 'react';
import {Steps} from 'antd';
import Button from "../../../../../components/uielements/button";
import {SelectIntegrationStep} from "./selectIntegrationStep";
import {SelectConnectorStep} from "./selectConnectorStep";
import {SelectProjectsStep, REFETCH_CONNECTOR_WORK_ITEMS_SOURCES_QUERY} from "./selectProjectsStep";
import {ConfigureImportStep} from "./configureImportStep";
import {ShowImportStateStep} from "./showImportStateStep";
import {work_tracking_service} from "../../../../services/graphql";
import gql from "graphql-tag";
import {refetchQueries} from "../../../../components/graphql/utils";
import {withNavigationContext} from "../../../../framework/navigation/components/withNavigationContext";
import '../../steps.css';
import './addProjectsWorkflow.css';

const {Step} = Steps;

const steps = [
  {
    title: 'Select Provider',
    content: SelectIntegrationStep,
    showNext: false
  },
  {
    title:  'Select Connector',
    content: SelectConnectorStep,
    showNext: false
  },
  {
    title: 'Select Projects',
    content: SelectProjectsStep,
    showNext: true,
    disableNextIf: ({selectedProjects}) => selectedProjects.length === 0
  },
  {
    title: 'Configure Import',
    content: ConfigureImportStep,
  },
  {
    title: 'Import Projects',
    content: ShowImportStateStep
  },
];

export const AddProjectWorkflow = withNavigationContext(
  class _AddProjectWorkflow extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        current: 0,
        selectedConnectorType: null,
        selectedConnector: {},
        selectedProjects: [],
        importedProjectKeys: [],
      };
    }

    next() {
      const current = this.state.current + 1;
      this.setState({current});
    }

    prev() {
      // if we are in the final stage, back should take us to Select Projects
      // since we will have cleared the selected projects at that point.
      const current = this.state.current < 4 ? this.state.current - 1 : 2;
      this.setState({current});
    }

    onConnectorTypeSelected(connectorType) {
      this.setState({
        current: 1,
        selectedConnectorType: connectorType,
      })
    }

    onConnectorSelected(connector) {
      this.setState({
        current: 2,
        selectedConnector: connector,
        selectedProjects: this.state.selectedConnector.key !== connector.key ? [] : this.state.selectedProjects
      })
    }


    onProjectsSelected(selectedProjects) {
      this.setState({
        selectedProjects: selectedProjects
      })
    }

    buildProjectsInput(importMode, selectedProjects, importedProjectName, importedProjectKey) {
      switch (importMode) {
        case 'single':
          return [{
            importedProjectName: importedProjectName,
            workItemsSources: selectedProjects.map(
              project => ({
                workItemsSourceName: project.name,
                workItemsSourceKey: project.key,
                importDays: project.importDays
              })
            )
          }]
        case 'existing':
          return [{
            existingProjectKey: importedProjectKey,
            workItemsSources: selectedProjects.map(
              project => ({
                workItemsSourceName: project.name,
                workItemsSourceKey: project.key,
                importDays: project.importDays
              })
            )
          }]
        default:
          return selectedProjects.map(
            project => ({
              importedProjectName: project.localName,
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

    async onImportConfigured(importMode, selectedProjects, importedProjectName = null, importedProjectKey = null) {
      const {organization, viewerContext} = this.props;

      try {
        const result = await work_tracking_service.mutate({
          mutation: gql`
              mutation importProjects($importProjectsInput: ImportProjectsInput!) {
                  importProjects(importProjectsInput: $importProjectsInput) {
                      projectKeys
                  }
              }
          `,
          variables: {
            importProjectsInput: {
              accountKey: viewerContext.accountKey,
              organizationKey: organization.key,
              projects: this.buildProjectsInput(importMode, selectedProjects, importedProjectName, importedProjectKey)
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
            current: 4,
            importedProjectKeys: result.data.importProjects.projectKeys,
            selectedProjects: []
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
      const {organization, onDone} = this.props;
      return (
        <div style={{height: "100%"}}>
          <h2>Import Projects</h2>
          <Steps current={current}>
            {steps.map((item, index) => (
              <Step key={index}
                    style={index > current ? {display: 'none'} : {}}
                    title={item.title}
              />
            ))}
          </Steps>
          <div className="steps-content">
            {
              React.createElement(steps[current].content, {
                  onConnectorTypeSelected: this.onConnectorTypeSelected.bind(this),
                  selectedConnectorType: this.state.selectedConnectorType,
                  onConnectorSelected: this.onConnectorSelected.bind(this),
                  selectedConnector: this.state.selectedConnector,
                  onProjectsSelected: this.onProjectsSelected.bind(this),
                  selectedProjects: this.state.selectedProjects,
                  onImportConfigured: this.onImportConfigured.bind(this),
                  importedProjectKeys: this.state.importedProjectKeys,
                  organizationKey: organization.key
                }
              )
            }
          </div>

          <div className="steps-action">
            {current > 0 && (
              <Button type="primary" style={{marginLeft: 8}} onClick={() => this.prev()}>
                {current < 4 ? 'Back' : 'Import More Projects'}
              </Button>
            )}
            {currentStep.showNext && current < steps.length - 1 && !disableNext && (
              <Button type="primary" onClick={() => this.next()}>
                Next
              </Button>
            )}
            {(disableNext || current === steps.length - 1) && (
              <Button type="primary" onClick={() => onDone && onDone(this.state.selectedProjects)}>
                Done
              </Button>
            )}

          </div>
        </div>
      );
    }
  })

import { ApolloProvider, gql } from "@apollo/client";
import React from 'react';

import {SelectIntegrationStep} from "./selectIntegrationStep";
import {SelectConnectorStep} from "./selectConnectorStep";
import {REFETCH_CONNECTOR_WORK_ITEMS_SOURCES_QUERY, SelectProjectsStep} from "./selectProjectsStep";
import {ConfigureImportStep} from "./configureImportStep";
import {ShowImportStateStep} from "./showImportStateStep";
import {work_tracking_service} from "../../../../services/graphql";
import {refetchQueries} from "../../../../components/graphql/utils";
import {withNavigationContext} from "../../../../framework/navigation/components/withNavigationContext";

import {WorkflowActionButton, WorkflowView} from "../../../../components/workflow";

function getSteps({connectorType}) {
  const steps = [
    {
      title: 'Select Provider',
      content: SelectIntegrationStep,
      showNext: false
    },
    {
      title: 'Select Connector',
      content: SelectConnectorStep,
      showNext: false
    },
    {
      title: connectorType === "trello" ? 'Select Boards' : 'Select Projects',
      content: SelectProjectsStep,
      showNext: true,
      disableNextIf: ({selectedProjects}) => selectedProjects.length === 0
    },
    {
      title: 'Configure Import',
      content: ConfigureImportStep,
    },
    {
      title: connectorType === "trello" ? 'Import Boards' : 'Import Projects',
      content: ShowImportStateStep
    },
  ];

  return steps;
}

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
        importedWorkItemsSourcesKeys: []
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
            importedWorkItemsSourcesKeys: selectedProjects.map(project => project.key),
            selectedProjects: []
          })
        }
      } catch (error) {
        console.log(`Error: ${error}`)
      }
    }

    render() {
      const {current, selectedConnector: {connectorType}} = this.state;
      const steps = getSteps({connectorType});
      const currentStep = steps[current];
      const disableNext = currentStep.disableNextIf && currentStep.disableNextIf(this.state);
      const {organization, onDone} = this.props;
      return (
        <ApolloProvider client={work_tracking_service}>
          <WorkflowView
            title={"Connect Remote Projects"}
            steps={steps}
            current={current}
            renderNavigationControls={
              () => (
                <React.Fragment>
                  {
                    <WorkflowActionButton onClick={() => onDone && onDone(this.state.selectedProjects)}>
                      Done
                    </WorkflowActionButton>
                  }
                  {current > 0 && (
                    <WorkflowActionButton onClick={() => this.prev()}>
                      {current < 4 ? 'Back' :(connectorType === "trello" ? 'Import More Boards' : 'Import More Projects')}
                    </WorkflowActionButton>
                  )}
                  {currentStep.showNext && current < steps.length - 1 && (
                    <WorkflowActionButton disabled={disableNext} onClick={() => this.next()}>
                      Next
                    </WorkflowActionButton>
                  )}
                </React.Fragment>
              )
            }
            stepProps={{
              onConnectorTypeSelected: this.onConnectorTypeSelected.bind(this),
              selectedConnectorType: this.state.selectedConnectorType,
              onConnectorSelected: this.onConnectorSelected.bind(this),
              selectedConnector: this.state.selectedConnector,
              onProjectsSelected: this.onProjectsSelected.bind(this),
              selectedProjects: this.state.selectedProjects,
              onImportConfigured: this.onImportConfigured.bind(this),
              importedProjectKeys: this.state.importedProjectKeys,
              importedWorkItemsSourcesKeys: this.state.importedWorkItemsSourcesKeys,
              organizationKey: organization.key
            }}
          />
        </ApolloProvider>
      );
    }
  })

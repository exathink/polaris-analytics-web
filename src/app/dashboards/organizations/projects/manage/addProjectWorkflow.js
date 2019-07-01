import React from 'react';
import './steps.css';
import {message, Steps} from 'antd';
import Button from "../../../../../components/uielements/button";
import {SelectConnectorStep} from "./selectConnectorStep";
import {SelectProjectsStep, REFETCH_CONNECTOR_WORK_ITEMS_SOURCES_QUERY} from "./selectProjectsStep";
import {ConfigureImportStep} from "./configureImportStep";
import {ShowImportStateStep} from "./showImportStateStep";
import {work_tracking_service} from "../../../../services/graphql";
import gql from "graphql-tag";
import  {refetchQueries} from "../../../../components/graphql/utils";

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
    content: ConfigureImportStep,
  },
  {
    title: 'Import Projects',
    content: ShowImportStateStep
  },
];


export class AddProjectWorkflow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      current: 0,
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
    const current = this.state.current < 3 ? this.state.current - 1 : 1;
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

  buildProjectsInput(importMode, selectedProjects, importedProjectName) {
    if (importMode === 'single') {
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
    } else {
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

  async onImportConfigured(importMode, selectedProjects, importedProjectName=null) {
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
            projects: this.buildProjectsInput(importMode, selectedProjects, importedProjectName)
          }
        },
        refetchQueries: (fetchData) => refetchQueries(
          [REFETCH_CONNECTOR_WORK_ITEMS_SOURCES_QUERY],
          {...this.props,...this.state} ,
          fetchData
        )
      })
      if (result.data) {
        this.setState({
          current: 3,
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
                selectedProjects: this.state.selectedProjects,
                onImportConfigured: this.onImportConfigured.bind(this),
                importedProjectKeys: this.state.importedProjectKeys
              }
            )
          }
        </div>

        <div className="steps-action">
          {current > 0 && (
            <Button type="primary" style={{marginLeft: 8}} onClick={() => this.prev()}>
              { current < 3 ? 'Back' : 'Import More Projects'}
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


import {gql} from "@apollo/client";
import {Query} from "@apollo/client/react/components"
import React from 'react';

import {analytics_service} from "../../../../services/graphql";

import {Radio} from "antd";

import {EditableTable} from "../../../../components/forms/editableTable";
import Button from "../../../../../components/uielements/button";
import {ProjectSetupForm} from './projectSetupForm';
import {capitalizeFirstLetter} from "../../../../helpers/utility";

const inputModeDescription = {
  single: 'Import as work stream(s) in a new Polaris Flow Value Stream',
  existing: 'Import as new work stream(s) into an existing Polaris Flow Value Stream',
  separate: 'Import each remote project as a separate Polaris Value Stream'
}

export const ORGANIZATION_PROJECT_COUNT_QUERY = gql`
query getOrganizationProjectCount($organizationKey: String!){
  organization(key: $organizationKey) {
      id
      projects(summariesOnly: true) {
        count
      }
    }
  }
`;

export const SelectImportMode = ({selectedProjects, importMode, onChange, organizationKey}) => {
  return (
    <Query
      client={analytics_service}
      query={ORGANIZATION_PROJECT_COUNT_QUERY}
      variables={{organizationKey}}
      fetchPolicy={'no-cache'}
    >
      {
        ({loading, error, data}) => {
          if (loading || error) return null;
          const projectCount = data.organization.projects.count;
          return (
            projectCount > 0 &&
            <React.Fragment>
              <h4>Select Import Mode</h4>
              <div><em>{inputModeDescription[importMode]}</em></div>
              <Radio.Group
                name="importMode"
                value={importMode}
                buttonStyle={"solid"}
                onChange={onChange}
              >
                <Radio.Button value={'single'}>New</Radio.Button>
                <Radio.Button value={'existing'}>Existing</Radio.Button>
              </Radio.Group>

            </React.Fragment>
          )
        }
      }
    </Query>
  )
};

export const SeparateModeImport = ({selectedProjects, handleSave, onImport}) => (
  <React.Fragment>
    <div className={'selected-projects'}>
      <EditableTable
        compact={true}
        dataSource={selectedProjects}
        columns={[
          {
            title: 'Remote project',
            dataIndex: 'name',
            width: '20%'
          },
          {
            title: 'Description',
            dataIndex: 'description',
            width: '40%'
          },
          {
            title: 'Polaris Flow Project',
            dataIndex: 'localName',
            editable: true,
            enableEdits: true,
            width: '20%'
          },
          {
            title: 'Days of history to import',
            dataIndex: 'importDays',
            editable: true,
            enableEdits: true,
            width: '20%'
          },
        ]}
        handleSave={handleSave}
        pagination={{
          total: selectedProjects.length,
          defaultPageSize: 5,
          hideOnSinglePage: true

        }}

      />
    </div>
  </React.Fragment>
)


export class ConfigureImportStep extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      importMode: 'single',
      importedProjectName: props.selectedProjects.length ? capitalizeFirstLetter(props.selectedProjects[0].name) : null,
      selectedProjectKey: null
    }
  }

  mapSelectedProjects(projects) {
    return projects.map(
      project => ({...project, ...{localName: project.name, importDays: 90}})
    )
  }

  onImportModeChanged(e) {
    this.setState({
      importMode: e.target.value,
      selectedProjects: this.mapSelectedProjects(this.props.selectedProjects)
    })
  }

  onProjectNameChanged(projectName) {
    console.log(projectName);
    this.setState({importedProjectName: projectName})
  }

  onProjectSelectChanged(projectKey) {
    this.setState({selectedProjectKey: projectKey})
  }

  onSave(record, values) {
    const editedProjects = [...this.state.selectedProjects];
    const index = editedProjects.findIndex(item => record.key === item.key);
    const item = editedProjects[index];
    editedProjects.splice(index, 1, {
      ...item,
      ...values,
    });
    this.setState({
      selectedProjects: editedProjects
    })
  }

  doImport(importMode, selectedProjects) {
    const {importedProjectName, selectedProjectKey} = this.state;

    switch (importMode) {
      case 'existing':
        this.props.onImportConfigured('existing', selectedProjects, null, selectedProjectKey)
        break;
      case 'separate':
        this.props.onImportConfigured('separate', selectedProjects)
        break;
      default: // single
        this.props.onImportConfigured('single', selectedProjects, importedProjectName)
    }
  }

  render() {
    const {importMode, importedProjectName} = this.state;
    const {organizationKey, onProjectsSelected} = this.props;
    const selectedProjects = this.mapSelectedProjects(this.props.selectedProjects);
    return (
      <div className={'import-project'}>
        <h3>{selectedProjects.length} remote {selectedProjects.length > 1 ? 'projects' : 'project'} selected for import</h3>
        {
          <SelectImportMode
            selectedProjects={selectedProjects}
            importMode={importMode}
            onChange={this.onImportModeChanged.bind(this)}
            organizationKey={organizationKey}
          />
        }
        {
          importMode === 'single' &&
          <ProjectSetupForm
            importMode={importMode}
            selectedProjects={selectedProjects}
            importedProjectName={importedProjectName}
            handleSave={this.onSave.bind(this)}
            onProjectNameChanged={this.onProjectNameChanged.bind(this)}
            onProjectsSelected={onProjectsSelected}
          />
        }
        {
          importMode === 'existing' &&
          <ProjectSetupForm
            importMode={importMode}
            organizationKey={organizationKey}
            selectedProjects={selectedProjects}
            selectedProjectKey={this.state.selectedProjectKey}
            onProjectSelectChanged={this.onProjectSelectChanged.bind(this)}
            onProjectsSelected={onProjectsSelected}
          />
        }
        {
          importMode === 'separate' &&
          <SeparateModeImport
            selectedProjects={selectedProjects}
            handleSave={this.onSave.bind(this)}
          />
        }
        <Button
          type={'primary'}
          onClick={
            () => this.doImport(importMode, selectedProjects)
          }
          disabled={this.state.importMode === 'existing' && this.state.selectedProjectKey === null}
        >Import {selectedProjects.length > 1 ? 'Projects' : 'Project'}</Button>
      </div>
    )
  }
}

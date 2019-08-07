import React from 'react';

import {Query} from "react-apollo";
import {analytics_service} from "../../../../services/graphql";
import gql from "graphql-tag";

import {Radio} from "antd";

import {EditableTable} from "../../../../components/forms/editableTable";
import Button from "../../../../../components/uielements/button";
import {ProjectSetupForm} from './projectSetupForm';

const inputModeDescription = {
  single: 'Import remote projects as sub-projects of a single local project',
  existing: 'Import remote projects into an existing project',
  separate: 'Import each remote project as a separate local project'
}

export const ORGANIZATION_PROJECT_COUNT_QUERY = gql`
query getOrganizationProjectCount($organizationKey: String!){
  organization(key: $organizationKey) {
      id
      projectCount
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
          const {projectCount} = data.organization;
          return (
            (projectCount > 0 || selectedProjects.length > 1) &&
            <React.Fragment>
              <h4>Import Mode</h4>
              <Radio.Group
                name="importMode"
                value={importMode}
                buttonStyle={"solid"}
                onChange={onChange}
              >
                <Radio.Button value={'single'}>Single</Radio.Button>
                {projectCount > 0 &&
                  <Radio.Button value={'existing'}>Existing</Radio.Button>
                }
                {selectedProjects.length > 1 &&
                  <Radio.Button value={'separate'}>Separate</Radio.Button>
                }
              </Radio.Group>
              <div className={'import-mode-text'}>
                {
                  inputModeDescription[importMode]
                }
              </div>
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
            title: 'Imported project name',
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
          defaultPageSize: 1,
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
      importMode: props.selectedProjects.length === 1 ? 'single' : 'separate',
      selectedProjects: this.mapSelectedProjects(props.selectedProjects),
      importedProjectName: props.selectedProjects.length ? props.selectedProjects[0].name : null,
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

  doImport(importMode) {
    const {selectedProjects, importedProjectName, selectedProjectKey} = this.state;
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
    const {selectedProjects, importMode, importedProjectName} = this.state;
    const {organizationKey} = this.props;
    return (
      <div className={'import-project'}>
        <h3>{selectedProjects.length} {selectedProjects.length > 1 ? 'projects' : 'project'} selected for import</h3>
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
          />
        }
        {
          importMode === 'existing' &&
          <ProjectSetupForm
            importMode={importMode}
            organizationKey={organizationKey}
            selectedProjects={selectedProjects}
            onProjectSelectChanged={this.onProjectSelectChanged.bind(this)}
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
            () => this.doImport(importMode)
          }
        >Import {selectedProjects.length > 1 ? 'Projects' : 'Project'}</Button>
      </div>
    )
  }
}

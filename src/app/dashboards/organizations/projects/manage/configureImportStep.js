import React from 'react';
import {Radio} from "antd";
import {EditableTable} from "../../../../components/forms/editableTable";
import Button from "../../../../../components/uielements/button";
import {ProjectSetupForm} from './projectSetupForm';

const inputModeDescription = {
  single: 'Import remote projects as sub-projects of a single local project',
  existing: 'Import remote projects into an existing project',
  separate: 'Import each remote project as a separate local project'
}

export const SelectImportMode = ({importMode, onChange, organization}) => {
  const {projectCount} = organization
  return (
    <React.Fragment>
      <h4>Import Mode</h4>
      <Radio.Group
        name="importMode"
        value={importMode}
        buttonStyle={"solid"}
        onChange={onChange}
      >
        <Radio.Button value={'single'}>Single</Radio.Button>
        {projectCount > 0 && <Radio.Button value={'existing'}>Existing</Radio.Button>}
        <Radio.Button value={'separate'}>Separate</Radio.Button>
      </Radio.Group>
      <div className={'import-mode-text'}>
        {
          inputModeDescription[importMode]
        }
      </div>
    </React.Fragment>

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
          },
          {
            title: 'Description',
            dataIndex: 'description'
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
    <Button
      type={'primary'}
      onClick={
        () => onImport()
      }
    >Import {selectedProjects.length > 1 ? 'Projects' : 'Project'}
    </Button>
  </React.Fragment>
)

export class ConfigureImportStep extends React.Component {


  constructor(props) {
    super(props);
    this.state = {
      importMode: props.selectedProjects.length == 1 ? 'single' : 'separate',
      selectedProjects: this.mapSelectedProjects(props.selectedProjects),
      importedProjectName: null,
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

  doSingleModeImport(importedProjectName) {
    this.props.onImportConfigured('single', this.state.selectedProjects, importedProjectName)
  }

  doExistingModeImport() {
     this.props.onImportConfigured('existing', this.state.selectedProjects, this.state.selectedProjectKey)
  }

  doSeparateModeImport() {
    this.props.onImportConfigured('separate', this.state.selectedProjects)
  }

  render() {
    const {selectedProjects, importMode} = this.state
    const {organization} = this.props
    return (
      <div className={'import-project'}>
        <h3>{selectedProjects.length} {selectedProjects.length > 1 ? 'projects' : 'project'} selected for import</h3>
        {
          <SelectImportMode
            selectedProjects={selectedProjects}
            importMode={importMode}
            onChange={this.onImportModeChanged.bind(this)}
            organization={organization}
          />
        }
        {
          this.state.importMode === 'single' && <ProjectSetupForm
            importMode={importMode}
            selectedProjects={selectedProjects}
            importedProjectName={this.state.importedProjectName}
            handleSave={this.onSave.bind(this)}
            onProjectNameChanged={this.onProjectNameChanged.bind(this)}
            onImport={this.doSingleModeImport.bind(this)}
          />
        }
        {
          this.state.importMode === 'existing' && <ProjectSetupForm
            importMode={importMode}
            organization={organization}
            selectedProjects={selectedProjects}
            onProjectSelectChanged={this.onProjectSelectChanged.bind(this)}
            onImport={this.doExistingModeImport.bind(this)}
          />
        }
        {
          this.state.importMode === 'separate' && <SeparateModeImport
            selectedProjects={selectedProjects}
            handleSave={this.onSave.bind(this)}
            onImport={this.doSeparateModeImport.bind(this)}
          />
        }
      </div>
    )
  }
}



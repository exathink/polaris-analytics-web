import React from 'react';
import {Col, Form, Input, Radio, Row, Table} from "antd";
import {EditableTable} from "../../../../components/forms/editableTable";
import Button from "../../../../../components/uielements/button";
import {ExistingModeImport} from "./existingModeImport";

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

const ProjectNameForm = (
  {
    selectedProjects,
    form: {
      getFieldDecorator
    }
  }
) => (
    <Form hideRequiredMark>
      <Row gutter={16}>
        <Col span={24}>
          <h4>Imported project name</h4>
          <Form.Item>
            {
              getFieldDecorator('localName', {
                rules: [
                  {required: true, message: 'Imported project name is required'}
                ],
                initialValue: selectedProjects[0].name
              })(<Input placeholder="Imported project name"/>)
            }
          </Form.Item>
        </Col>
      </Row>
    </Form>
  )


export const SingleModeImport = Form.create()(({form, handleSave, selectedProjects, onImport}) => {
  return (
    <React.Fragment>
      <div className={'selected-projects'}>
        <ProjectNameForm form={form} selectedProjects={selectedProjects}/>
        <React.Fragment>
          {selectedProjects.length > 1 && <h4>Remote Projects</h4>}
          <EditableTable
            dataSource={selectedProjects}
            columns={[
              {
                title: selectedProjects.length > 1 ? 'Sub-project' : 'Remote project',
                dataIndex: 'name',
              },
              {
                title: 'Description',
                dataIndex: 'description'
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
        </React.Fragment>
      </div>
      <Button
        type={'primary'}
        onClick={
          () => onImport(form.getFieldValue('localName'))
        }
      >Import Project</Button>
    </React.Fragment>
  )
}
)

export class ConfigureImportStep extends React.Component {


  constructor(props) {
    super(props);
    this.state = {
      importMode: props.selectedProjects.length == 1 ? 'single' : 'separate',
      selectedProjects: this.mapSelectedProjects(props.selectedProjects),
      importedProjectName: null,
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

  doExistingModeImport(importedProjectName) {
    // this.props.onImportConfigured('single', this.state.selectedProjects, importedProjectName)
    console.log(importedProjectName);
  }

  doSeparateModeImport() {
    this.props.onImportConfigured('separate', this.state.selectedProjects)
  }

  render() {
    const {selectedProjects} = this.state
    const {organization} = this.props
    return (
      <div className={'import-project'}>
        <h3>{selectedProjects.length} {selectedProjects.length > 1 ? 'projects' : 'project'} selected for import</h3>
        {
          <SelectImportMode
            selectedProjects={selectedProjects}
            importMode={this.state.importMode}
            onChange={this.onImportModeChanged.bind(this)}
            organization={organization}
          />

        }
        {
          this.state.importMode === 'single' && <SingleModeImport
            selectedProjects={selectedProjects}
            importedProjectName={this.state.importedProjectName}
            handleSave={this.onSave.bind(this)}
            onProjectNameChanged={this.onProjectNameChanged.bind(this)}
            onImport={this.doSingleModeImport.bind(this)}
          />
        }
        {
          this.state.importMode === 'existing' && <ExistingModeImport
            selectedProjects={selectedProjects}
            handleSave={this.onSave.bind(this)}
            onImport={this.doExistingModeImport.bind(this)}
            organization={organization}
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



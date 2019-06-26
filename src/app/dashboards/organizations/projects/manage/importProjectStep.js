import React from 'react';
import {Col, Form, Input, Radio, Row, Table} from "antd";
import {EditableTable} from "../../../../components/forms/editableTable";
import Button from "../../../../../components/uielements/button";
import {createForm} from "../../../../components/forms/createForm";

export const SelectImportMode = ({importMode, onChange}) => (
  <React.Fragment>
    <Radio.Group
      name="importMode"
      value={importMode}
      buttonStyle={"solid"}
      onChange={onChange}
    >
      <Radio.Button value={'separate'}>Separate</Radio.Button>
      <Radio.Button value={'single'}>Single</Radio.Button>
    </Radio.Group>
    <div className={'import-mode-text'}>
      {
        importMode === 'separate' ?
          'Import each remote project as a separate local project' :
          'Import remote projects as sub-projects of a local project'
      }
    </div>
  </React.Fragment>

);


export const SeparateModeImport = ({selectedProjects, handleSave}) => (
  <React.Fragment>
    <div className={'selected-projects'}>
      <EditableTable
        dataSource={selectedProjects}
        columns={[
          {
            title: 'Remote Project',
            dataIndex: 'name',
          },
          {
            title: 'Description',
            dataIndex: 'description'
          },
          {
            title: 'Local Project Name',
            dataIndex: 'localName',
            editable: true,
            enableEdits: true,
            width: '30%'
          },
        ]}
        handleSave={handleSave}
        pagination={{
          total: selectedProjects.length,
          defaultPageSize: 10,
          hideOnSinglePage: true

        }}
      />
    </div>
    <Button type={'primary'}>Import {selectedProjects.length > 1 ? 'Projects' : 'Project'}</Button>
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
        <h4>Local Project Name</h4>
        <Form.Item>
          {
            getFieldDecorator('localName', {
              rules: [
                {required: true, message: 'Local Project Name is required'}
              ],
              initialValue: selectedProjects[0].name
            })(<Input placeholder="Local Project Name"/>)
          }
        </Form.Item>
      </Col>
    </Row>
  </Form>
)


export const SingleModeImport = Form.create()(({form, selectedProjects, onProjectNameChanged}) => {
  return (
    <React.Fragment>
      <div className={'selected-projects'}>
        <ProjectNameForm form={form} selectedProjects={selectedProjects}/>
        <React.Fragment>
          {selectedProjects.length > 1 && <h4>Remote Projects</h4>}
          <Table
            dataSource={selectedProjects}
            pagination={{
              total: selectedProjects.length,
              defaultPageSize: 10,
              hideOnSinglePage: true

            }}
          >
            <Table.Column title={selectedProjects.length > 1 ? 'Sub-Project' : 'Remote Project'} dataIndex={'name'}/>
            <Table.Column title={'Description'} dataIndex={'description'}/>
          </Table>
        </React.Fragment>
      </div>
      <Button type={'primary'}>Import Project</Button>
    </React.Fragment>
  )
}
)

export class ImportProjectStep extends React.Component {


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
      project => ({...project, ...{localName: project.name}})
    )
  }


  onImportModeChanged(e) {
    this.setState({
        importMode: e.target.value,
        selectedProjects: this.mapSelectedProjects(this.props.selectedProjects)
      }
    )
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

  render() {
    const {selectedProjects} = this.state

    return (
      <div className={'import-project'}>
        {
          selectedProjects.length > 1 ?
            <SelectImportMode selectedProjects={selectedProjects} importMode={this.state.importMode}
                              onChange={this.onImportModeChanged.bind(this)}/>
            : null
        }
        {
          this.state.importMode === 'separate' ?
            <SeparateModeImport selectedProjects={selectedProjects} handleSave={this.onSave.bind(this)}/>
            :
            <SingleModeImport selectedProjects={selectedProjects}
                              importedProjectName={this.state.importedProjectName}
                              onProjectNameChanged={this.onProjectNameChanged.bind(this)}/>
        }

      </div>
    )
  }
}



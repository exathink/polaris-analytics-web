import React from 'react';
import {Col, Form, Input, Row} from "antd";
import {EditableTable} from "../../../../components/forms/editableTable";
import {capitalizeFirstLetter} from "../../../../helpers/utility";
import {OrganizationProjectSelectorWidget} from "../../../shared/widgets/organizations/organizationProjectSelectorWidget";
import {useSelectionHandler} from "../../../../components/tables/hooks";

const ProjectNameForm = (
  {
    selectedProjects,
    importedProjectName,
    form: {
      getFieldDecorator
    },
    label,
    onProjectNameChanged
  }
) => {
  const formItemLayout = {
    labelCol: {
      span: 8
    },
    wrapperCol: {
      span: 10
    }
  };
  return (
    <Form hideRequiredMark>
      <Row gutter={16}>
        <Col span={24}>
          <Form.Item
            {...formItemLayout}
            label={label}
          >
            {

              getFieldDecorator('localName', {
                rules: [
                  {required: true, message: 'Imported project name is required'}
                ],
                initialValue: importedProjectName || capitalizeFirstLetter(selectedProjects[0].name)
              })(<Input
                onChange={e => onProjectNameChanged(e.target.value)}
              />)
            }
          </Form.Item>
        </Col>
      </Row>
    </Form>
  )
}
export const ProjectSetupForm = Form.create()(({form, handleSave, selectedProjects, onProjectsSelected,  selectedProjectKey, importedProjectName, importMode, organizationKey, onProjectNameChanged, onProjectSelectChanged}) => {
  return (
    <React.Fragment>
      <div className={'selected-projects'}>
        {importMode === 'single' &&
          <ProjectNameForm
            form={form}
            selectedProjects={selectedProjects}
            importedProjectName={importedProjectName}
            onProjectNameChanged={onProjectNameChanged}
            label={"Urjuna Project"}
          />
        }
        {importMode === 'existing' &&
          <OrganizationProjectSelectorWidget
            organizationKey={organizationKey}
            selectedProjectKey={selectedProjectKey}
            onProjectSelectChanged={onProjectSelectChanged}
            placeholder="Select an existing project"
          />
        }
        <React.Fragment>
          <EditableTable
            dataSource={selectedProjects}
            columns={[
              {
                title: 'Remote project',
                dataIndex: 'name',
                width: '30%'
              },
              {
                title: 'Description',
                dataIndex: 'description',
                width: '50%'
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
              defaultPageSize: 3,
              hideOnSinglePage: true
            }}
            rowSelection={useSelectionHandler(onProjectsSelected, selectedProjects)}
          />
        </React.Fragment>
      </div>
    </React.Fragment>
  )
}
)

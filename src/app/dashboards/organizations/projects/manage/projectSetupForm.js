import React from 'react';
import {Col, Form, Input, Row} from "antd";
import {EditableTable} from "../../../../components/forms/editableTable";

import {OrganizationProjectSelectorWidget} from "../../../shared/widgets/organizations/organizationProjectSelectorWidget";

const ProjectNameForm = (
  {
    selectedProjects,
    form: {
      getFieldDecorator
    },
    placeholder,
    onProjectNameChanged
  }
) => {
  return (
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
              })(<Input
                placeholder={placeholder}
                onChange={e => onProjectNameChanged(e.target.value)}
              />)
            }
          </Form.Item>
        </Col>
      </Row>
    </Form>
  )
}
export const ProjectSetupForm = Form.create()(({form, handleSave, selectedProjects, importMode, organizationKey, onProjectNameChanged, onProjectSelectChanged}) => {
  return (
    <React.Fragment>
      <div className={'selected-projects'}>
        {importMode == 'single' &&
          <ProjectNameForm
            form={form}
            selectedProjects={selectedProjects}
            onProjectNameChanged={onProjectNameChanged}
            placeholder="Imported project name"
          />
        }
        {importMode == 'existing' &&
          <OrganizationProjectSelectorWidget
            organizationKey={organizationKey}
            onProjectSelectChanged={onProjectSelectChanged}
            placeholder="Select an existing project"
          />
        }
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
    </React.Fragment>
  )
}
)

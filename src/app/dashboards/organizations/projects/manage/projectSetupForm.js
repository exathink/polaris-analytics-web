import React from 'react';
import {Col, Form, Input, Row} from "antd";
import {EditableTable} from "../../../../components/forms/editableTable";
import Button from "../../../../../components/uielements/button";

import {ExistingModeImport} from "./existingModeImport";

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
              })(<Input placeholder="Imported project name" />)
            }
          </Form.Item>
        </Col>
      </Row>
    </Form>
  )

function handleClick(onImport, importMode, form) {
  const value = importMode == 'single' ? form.getFieldValue('localName') : null;
  onImport(value);
}

export const ProjectSetupForm = Form.create()(({form, handleSave, selectedProjects, onImport, importMode, organization, onProjectSelectChanged}) => {
  return (
    <React.Fragment>
      <div className={'selected-projects'}>
        {importMode == 'single' && <ProjectNameForm form={form} selectedProjects={selectedProjects} />}
        {importMode == 'existing' &&
          <ExistingModeImport
            organization={organization}
            onProjectSelectChanged={onProjectSelectChanged}
          />}
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
          () => handleClick(onImport, importMode, form)
        }
      >Import Project</Button>
    </React.Fragment>
  )
}
)

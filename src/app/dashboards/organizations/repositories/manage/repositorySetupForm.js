import React from 'react';
import {Col, Form, Input, Row} from "antd";
import {EditableTable} from "../../../../components/forms/editableTable";

import {OrganizationProjectSelectorWidget} from "../../../shared/widgets/organizations/organizationProjectSelectorWidget";

const RepositoryNameForm = (
  {
    selectedRepositories,
    form: {
      getFieldDecorator
    },
    placeholder,
    onRepositoryNameChanged
  }
) => {
  return (
    <Form hideRequiredMark>
      <Row gutter={16}>
        <Col span={24}>
          <h4>Imported repository name</h4>
          <Form.Item>
            {
              getFieldDecorator('localName', {
                rules: [
                  {required: true, message: 'Imported repository name is required'}
                ],
                initialValue: selectedRepositories[0].name
              })(<Input
                placeholder={placeholder}
                onChange={e => onRepositoryNameChanged(e.target.value)}
              />)
            }
          </Form.Item>
        </Col>
      </Row>
    </Form>
  )
}
export const RepositorySetupForm = Form.create()(({form, handleSave, selectedRepositories, importMode, organizationKey, onRepositoryNameChanged, onRepositorySelectChanged}) => {
  return (
    <React.Fragment>
      <div className={'selected-repositories'}>
        {importMode == 'single' &&
          <RepositoryNameForm
            form={form}
            selectedRepositories={selectedRepositories}
            onRepositoryNameChanged={onRepositoryNameChanged}
            placeholder="Imported repository name"
          />
        }
        {importMode == 'existing' &&
          <OrganizationProjectSelectorWidget
            organizationKey={organizationKey}
            onRepositorySelectChanged={onRepositorySelectChanged}
            placeholder="Select an existing repository"
          />
        }
        <React.Fragment>
          {selectedRepositories.length > 1 && <h4>Remote Repositories</h4>}
          <EditableTable
            dataSource={selectedRepositories}
            columns={[
              {
                title: selectedRepositories.length > 1 ? 'Sub-repository' : 'Remote repository',
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
              total: selectedRepositories.length,
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

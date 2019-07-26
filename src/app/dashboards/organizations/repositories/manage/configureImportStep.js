import React from 'react';
import {Query} from "react-apollo";
import gql from "graphql-tag";
import {Radio} from "antd";
import {analytics_service} from "../../../../services/graphql";
import {EditableTable} from "../../../../components/forms/editableTable";
import Button from "../../../../../components/uielements/button";
import {RepositorySetupForm} from './repositorySetupForm';

const inputModeDescription = {
  single: 'Import remote repositories as sub-repositories of a single local repository',
  existing: 'Import remote repositories into an existing repository'
}

export const ORGANIZATION_REPOSITORY_COUNT_QUERY = gql`
query getOrganizationRepositoryCount($organizationKey: String!){
  organization(key: $organizationKey) {
      id
      repositoryCount
    }
  }
`;

export const SelectImportMode = ({selectedRepositories, importMode, onChange, organizationKey}) => {
  return (
    <Query
      client={analytics_service}
      query={ORGANIZATION_REPOSITORY_COUNT_QUERY}
      variables={{organizationKey}}
      fetchPolicy={'no-cache'}
    >
      {
        ({loading, error, data}) => {
          if (loading || error) return null;
          const {repositoryCount} = data.organization;
          return (
            (repositoryCount > 0 || selectedRepositories.length > 1) &&
            <React.Fragment>
              <h4>Import Mode</h4>
              <Radio.Group
                name="importMode"
                value={importMode}
                buttonStyle={"solid"}
                onChange={onChange}
              >
                <Radio.Button value={'single'}>Single</Radio.Button>
                {repositoryCount > 0 &&
                  <Radio.Button value={'existing'}>Existing</Radio.Button>
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

export const SeparateModeImport = ({selectedRepositories, handleSave}) => (
  <React.Fragment>
    <div className={'selected-repositories'}>
      <EditableTable
        dataSource={selectedRepositories}
        columns={[
          {
            title: 'Remote repository',
            dataIndex: 'name',
          },
          {
            title: 'Description',
            dataIndex: 'description'
          },
          {
            title: 'Imported repository name',
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
          total: selectedRepositories.length,
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
      importMode: 'single',
      selectedRepositories: this.mapSelectedRepositories(props.selectedRepositories),
      importedRepositoryName: props.selectedRepositories.length ? props.selectedRepositories[0].name : null,
      selectedRepositoryKey: null
    }
  }

  mapSelectedRepositories(repositories) {
    return repositories.map(
      repository => ({...repository, ...{localName: repository.name, importDays: 90}})
    )
  }

  onImportModeChanged(e) {
    this.setState({
      importMode: e.target.value,
      selectedRepositories: this.mapSelectedRepositories(this.props.selectedRepositories)
    })
  }

  onRepositoryNameChanged(repositoryName) {
    this.setState({importedRepositoryName: repositoryName})
  }

  onRepositorySelectChanged(repositoryKey) {
    this.setState({selectedRepositoryKey: repositoryKey})
  }

  onSave(record, values) {
    const editedRepositories = [...this.state.selectedRepositories];
    const index = editedRepositories.findIndex(item => record.key === item.key);
    const item = editedRepositories[index];
    editedRepositories.splice(index, 1, {
      ...item,
      ...values,
    });
    this.setState({
      selectedRepositories: editedRepositories
    })
  }

  doImport(importMode) {
    const {selectedRepositories, importedRepositoryName, selectedRepositoryKey} = this.state;
    switch (importMode) {
      case 'existing':
        this.props.onImportConfigured('existing', selectedRepositories, null, selectedRepositoryKey)
        break;
      default: // single
        this.props.onImportConfigured('single', selectedRepositories, importedRepositoryName)
    }
  }

  render() {
    const {selectedRepositories, importMode, importedRepositoryName} = this.state;
    const {organizationKey} = this.props;
    return (
      <div className={'import-repository'}>
        <h3>{selectedRepositories.length} {selectedRepositories.length > 1 ? 'repositories' : 'repository'} selected for import</h3>
        {
          <SelectImportMode
            selectedRepositories={selectedRepositories}
            importMode={importMode}
            onChange={this.onImportModeChanged.bind(this)}
            organizationKey={organizationKey}
          />
        }
        {
          importMode === 'single' &&
          <RepositorySetupForm
            importMode={importMode}
            selectedRepositories={selectedRepositories}
            importedRepositoryName={importedRepositoryName}
            handleSave={this.onSave.bind(this)}
            onRepositoryNameChanged={this.onRepositoryNameChanged.bind(this)}
          />
        }
        {
          importMode === 'existing' &&
          <RepositorySetupForm
            importMode={importMode}
            organizationKey={organizationKey}
            selectedRepositories={selectedRepositories}
            onRepositorySelectChanged={this.onRepositorySelectChanged.bind(this)}
          />
        }
        <Button
          type={'primary'}
          onClick={
            () => this.doImport(importMode)
          }
        >Import {selectedRepositories.length > 1 ? 'Repositories' : 'Repository'}</Button>
      </div>
    )
  }
}



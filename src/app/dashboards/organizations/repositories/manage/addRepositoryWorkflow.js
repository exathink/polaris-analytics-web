import React from 'react';
import {Steps} from 'antd';
import Button from "../../../../../components/uielements/button";
import {SelectIntegrationStep} from "./selectIntegrationStep";
import {SelectConnectorStep} from "./selectConnectorStep";
import {SelectRepositoriesStep, REFETCH_CONNECTOR_REPOSITORIES_QUERY} from "./selectRepositoriesStep";
import {ReviewImportStep} from "./reviewImportStep";
import {ShowImportStateStep} from "./showImportStateStep";
import {vcs_service} from "../../../../services/graphql";
import gql from "graphql-tag";
import {refetchQueries} from "../../../../components/graphql/utils";
import {withNavigationContext} from "../../../../framework/navigation/components/withNavigationContext";
import '../../steps.css';

const {Step} = Steps;

const steps = [
  {
    title: 'Select Provider',
    content: SelectIntegrationStep,
    showNext: false
  },
  {
    title: 'Select Connector',
    content: SelectConnectorStep,
    showNext: false
  },
  {
    title: 'Select Repositories',
    content: SelectRepositoriesStep,
    showNext: true,
    disableNextIf: ({selectedRepositories}) => selectedRepositories.length == 0
  },
  {
    title: 'Review Import',
    content: ReviewImportStep,
    showNext: false
  },
  {
    title: 'Import Repositories',
    content: ShowImportStateStep,
    showNext: false
  }
];

export const AddRepositoryWorkflow = withNavigationContext(
  class _AddRepositoryWorkflow extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        current: 0,
        selectedConnectorType: null,
        selectedConnector: {},
        selectedRepositories: []
      };
    }

    next() {
      const current = this.state.current + 1;
      this.setState({current});
    }

    prev() {
      // if we are in the final stage, back should take us to Select Repositories
      // since we will have cleared the selected projects at that point.
      const current = this.state.current < 4 ? this.state.current - 1 : 2;
      this.setState({current});
    }

    onConnectorTypeSelected(connectorType) {
      this.setState({
        current: 1,
        selectedConnectorType: connectorType,
      })
    }

    onConnectorSelected(connector) {
      this.setState({
        current: 2,
        selectedConnector: connector,
        selectedRepositories: this.state.selectedConnector.key !== connector.key ? [] : this.state.selectedRepositories
      })
    }

    onRepositoriesSelected(record, selected) {
      const curSelectedList = this.state.selectedRepositories;
      let newSelectedList = [];
      if (selected) {
        newSelectedList = [...curSelectedList, record];
      } else {
        newSelectedList = curSelectedList.filter(item => item.key !== record.key);
      }
      this.setState({
        selectedRepositories: newSelectedList
      });
    }

    onAllRepositoriesSelected(selected, selectedRows, changeRows) {
      const curSelectedList = this.state.selectedRepositories;
      let newSelectedList = [];
      if (selected) {
        newSelectedList = [...curSelectedList, ...changeRows];
      } else {
        newSelectedList = curSelectedList.filter(currentRecord => !changeRows.find(changedRecord => currentRecord.key !== changedRecord.key));
      }
      this.setState({
        selectedRepositories: newSelectedList
      });
    }

    getRepositoryKeys() {
      const {selectedRepositories} = this.state;
      return selectedRepositories.map(repo => repo.key)
    }

    async onDoImport() {
      const {organization, viewerContext} = this.props;
      try {
        const result = await vcs_service.mutate({
          mutation: gql`
              mutation importRepositories($importRepositoriesInput: ImportRepositoriesInput!) {
                  importRepositories(importRepositoriesInput: $importRepositoriesInput) {
                    importedRepositoryKeys
                  }
              }
          `,
          variables: {
            importRepositoriesInput: {
              organizationKey: organization.key,
              repositoryKeys: this.getRepositoryKeys()
            }
          },
          refetchQueries: (fetchData) => refetchQueries(
            [REFETCH_CONNECTOR_REPOSITORIES_QUERY],
            {...this.props, ...this.state},
            fetchData
          )
        })
        if (result.data) {
          this.setState({
            current: 4,
            importedRepositoryKeys: result.data.importRepositories.importedRepositoryKeys,
            selectedRepositories: []
          })
        }
      } catch (error) {
        console.log(`Error: ${error}`)
      }
    }


    render() {
      const {current} = this.state;
      const currentStep = steps[current];
      const disableNext = currentStep.disableNextIf && currentStep.disableNextIf(this.state);
      const {context, organization, onDone} = this.props;
      return (
        <React.Fragment>
          <h2>Import Repositories</h2>
          <Steps current={current}>
            {steps.map((item, index) => (
              <Step key={index}
                style={index > current ? {display: 'none'} : {}}
                title={item.title}
              />
            ))}
          </Steps>
          <div className="steps-content">
            {
              React.createElement(steps[current].content, {
                organizationKey: organization.key,
                onConnectorTypeSelected: this.onConnectorTypeSelected.bind(this),
                selectedConnectorType: this.state.selectedConnectorType,
                onConnectorSelected: this.onConnectorSelected.bind(this),
                selectedConnector: this.state.selectedConnector,
                onRepositoriesSelected: this.onRepositoriesSelected.bind(this),
                onAllRepositoriesSelected: this.onAllRepositoriesSelected.bind(this),
                selectedRepositories: this.state.selectedRepositories,
                onDoImport: this.onDoImport.bind(this),
                importedRepositoryKeys: this.state.importedRepositoryKeys
              })
            }
          </div>

          <div className="steps-action">
            {current > 0 && (
              <Button type="primary" style={{marginLeft: 8}} onClick={() => this.prev()}>
                {current < 4 ? 'Back' : 'Import More Repositories'}
              </Button>
            )}
            {currentStep.showNext && current < steps.length - 1 && !disableNext && (
              <Button type="primary" onClick={() => this.next()}>
                Next
            </Button>
            )}
            {(disableNext || current === steps.length - 1) && (
              <Button type="primary" onClick={() => onDone && onDone(this.state.importedRepositoryKeys)}>
                Done
            </Button>
            )}

          </div>
        </React.Fragment>
      );
    }
  })

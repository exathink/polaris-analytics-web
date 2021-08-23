import { ApolloProvider, gql } from "@apollo/client";
import React from 'react';

import {SelectIntegrationStep} from "./selectIntegrationStep";
import {SelectConnectorStep} from "./selectConnectorStep";
import {REFETCH_CONNECTOR_REPOSITORIES_QUERY, SelectRepositoriesStep} from "./selectRepositoriesStep";
import {ReviewImportStep} from "./reviewImportStep";
import {ShowImportStateStep} from "./showImportStateStep";
import {vcs_service} from "../../../../services/graphql";
import {refetchQueries} from "../../../../components/graphql/utils";
import {withNavigationContext} from "../../../../framework/navigation/components/withNavigationContext";
import {openNotification} from "../../../../helpers/utility";

import {WorkflowActionButton, WorkflowView} from "../../../../components/workflow";
import {BackArrowIcon} from "../../../../components/misc/customIcons";

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
    disableNextIf: ({selectedRepositories}) => selectedRepositories.length === 0
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

    onRepositoriesSelected(selectedRepositories) {
      this.setState({
        selectedRepositories: selectedRepositories
      })
    }

    getRepositoryKeys() {
      const {selectedRepositories} = this.state;
      return selectedRepositories.map(repo => repo.key)
    }

    async getActiveImports() {
      const {selectedConnector} = this.state;
      try {
        const result = await vcs_service.query({
          query: gql`
          query getActiveImports($connectorKey: String!) {
            vcsConnector(key: $connectorKey) {
              id
              repositories(importMode: importing) {
                edges {
                  node {
                    id
                    key
                  }
                }
              }
            }
          }`,
          variables: {
            connectorKey: selectedConnector.key
          },
          fetchPolicy: 'network-only'
        })
        if (result.data) {
          if (!result.data.vcsConnector.repositories.edges.length) {
            openNotification('warn', 'There are no imports in progress')
            return
          } else {
            this.setState({
              current: 4,
              importedRepositoryKeys: result.data.vcsConnector.repositories.edges.map(row => row.node.key),
              selectedRepositories: []
            })
          }
        }
      } catch (error) {
        console.log(`Error: ${error}`)
      }
    }

    async onDoImport() {
      const {organization} = this.props;
      const {selectedConnector} = this.state;

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
              connectorKey: selectedConnector.key,
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
          this.getActiveImports()
        }
      } catch (error) {
        console.log(`Error: ${error}`)
      }
    }


    render() {
      const {current} = this.state;
      const currentStep = steps[current];
      const disableNext = currentStep.disableNextIf && currentStep.disableNextIf(this.state);
      const {organization, onDone} = this.props;
      return (
        <ApolloProvider client={vcs_service}>
          <WorkflowView
            title={"Connect Remote Repositories"}
            steps={steps}
            current={current}
            renderNavigationControls={() => {
              return {
                doneButton: () => (
                  <WorkflowActionButton
                    onClick={() => onDone && onDone(this.state.importedRepositoryKeys)}
                    type="secondary"
                  >
                    Done
                  </WorkflowActionButton>
                ),
                backButton: () => current > 0 && current < 4 && (<BackArrowIcon onClick={() => this.prev()}/>),
                importMoreButton: () => current===4 && <WorkflowActionButton onClick={() => this.prev()}>Import More Repositories</WorkflowActionButton>,
                nextButton: () =>
                  currentStep.showNext &&
                  current < steps.length - 1 && (
                    <WorkflowActionButton disabled={disableNext} onClick={() => this.next()}>
                      Next
                    </WorkflowActionButton>
                  ),
              };
            }}
            stepProps={{
              organizationKey: organization.key,
              onConnectorTypeSelected: this.onConnectorTypeSelected.bind(this),
              selectedConnectorType: this.state.selectedConnectorType,
              onConnectorSelected: this.onConnectorSelected.bind(this),
              selectedConnector: this.state.selectedConnector,
              onRepositoriesSelected: this.onRepositoriesSelected.bind(this),
              selectedRepositories: this.state.selectedRepositories,
              onDoImport: this.onDoImport.bind(this),
              getActiveImports: this.getActiveImports.bind(this),
              importedRepositoryKeys: this.state.importedRepositoryKeys
            }}
          />
        </ApolloProvider>
      );
    }
  })

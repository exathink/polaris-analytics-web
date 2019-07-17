import React from 'react';

import {Query} from "react-apollo";
import {analytics_service} from "../../../../services/graphql";
import gql from "graphql-tag";

import {Select, Button} from 'antd';
const {Option} = Select;

export class ExistingModeImport extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      selected: null
    }
  }

  onSelectionChange(value) {
    const newState = {
      ...this.state,
      selected: value
    };
    this.setState(newState);
  }

  render() {
    const {selected} = this.state;
    return (
      <Query
        client={analytics_service}
        query={
          gql`
          query getOrganizationProjects($organizationKey: String!){
            organization(key: $organizationKey) {
                projects {
                  edges {
                    node {
                      id
                      name
                    }
                  }
                }
              }
          }
          `}
        variables={{
          organizationKey: this.props.organization.key
        }}
      >
        {
          ({loading, error, data}) => {
            if (loading || error) return null;
            const {edges: projects} = data.organization.projects;
            return (
              <React.Fragment>
                <div className={'selected-projects'}>
                  <Select onChange={value => this.onSelectionChange(value)} placeholder="Select an existing project">
                    {projects.map(project => <Option value={project.node.id}>{project.node.name}</Option>)}
                  </Select>
                </div>
                <Button
                  disabled={!selected}
                  type={'primary'}
                  value={selected}
                  onClick={
                    () => this.props.onImport()
                  }
                >Import {this.props.selectedProjects.length > 1 ? 'Projects' : 'Project'}
                </Button>
              </React.Fragment>
            )
          }
        }
        }
      </Query>
    )
  }
}

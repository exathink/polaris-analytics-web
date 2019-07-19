import React from 'react';

import {Query} from "react-apollo";
import {analytics_service} from "../../../../services/graphql";
import gql from "graphql-tag";

import {Select} from 'antd';
const {Option} = Select;

export class ExistingModeImport extends React.Component {

  render() {
    const {key: organizationKey} = this.props.organization
    return (
      <Query
        client={analytics_service}
        query={
          gql`
          query getOrganizationProjects($organizationKey: String!){
            organization(key: $organizationKey) {
              id
              projects {
                  edges {
                    node {
                        id
                        name
                        key
                    }
                  }
                }
              }
            }
          `
        }
        variables={{
          organizationKey: organizationKey
        }}
      >
        {
          ({loading, error, data}) => {
            if (loading || error) return null;
            const {edges: projects} = data.organization.projects;
            return (
              <React.Fragment>
                <div className={'selected-projects'}>
                  <Select onChange={value => this.props.onProjectSelectChanged(value)} placeholder="Select an existing project">
                    {projects.map(project => <Option key={project.node.key} value={project.node.key}>{project.node.name}</Option>)}
                  </Select>
                </div>
              </React.Fragment>
            )
          }
        }
      </Query>
    )
  }
}

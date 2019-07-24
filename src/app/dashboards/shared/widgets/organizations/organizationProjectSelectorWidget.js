import React from 'react';

import {Query} from "react-apollo";
import {analytics_service} from "../../../../services/graphql";
import gql from "graphql-tag";

import {Select} from 'antd';
const {Option} = Select;

export const ORGANIZATION_PROJECT_QUERY = gql`
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

export class OrganizationProjectSelectorWidget extends React.Component {

  render() {
    const {organizationKey, placeholder} = this.props;
    return (
      <Query
        client={analytics_service}
        query={ORGANIZATION_PROJECT_QUERY}
        variables={{
          organizationKey
        }}
        fetchPolicy={'cache-and-network'}
      >
        {
          ({loading, error, data}) => {
            if (loading || error) return null;
            const {edges: projects} = data.organization.projects;
            return (
              <React.Fragment>
                <div className={'selected-projects'}>
                  <h4>Select a project</h4>
                  <Select
                    onChange={value => this.props.onProjectSelectChanged(value)}
                    placeholder={placeholder}
                  >
                    {projects.map(project =>
                      <Option key={project.node.key}
                        value={project.node.key}>{project.node.name}
                      </Option>
                    )}
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

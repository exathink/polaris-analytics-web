import React from 'react';
import gql from "graphql-tag";
import {Query} from "react-apollo";
import {Select} from 'antd';
import {Flex} from 'reflexbox';
import {analytics_service} from "../../../../services/graphql";

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
    const {organizationKey, selectedProjectKey, placeholder} = this.props;
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
              projects.length > 0 && (
                <React.Fragment>
                  <Flex style={{paddingTop: '10px', paddingBottom: '8px' ,justifyContent: 'center', alignContent: 'center'}}>
                    <span style={{fontSize: '14px', fontWeight: '800' , alignSelf: 'center', paddingRight: '10px'}}>Select Existing Value Stream: </span>
                    <Select
                      className={'projects-selector'}
                      onChange={value => this.props.onProjectSelectChanged(value)}
                      placeholder={placeholder}
                      defaultValue={selectedProjectKey}
                      style={{alignSelf: 'center'}}
                    >
                      {projects.map(project =>
                        <Option key={project.node.key}
                                value={project.node.key}>{project.node.name}
                        </Option>
                      )}
                    </Select>
                  </Flex>
                </React.Fragment>
              )
            )
          }
        }
      </Query>
    )
  }
}

import {gql} from "@apollo/client";
import {Query} from "@apollo/client/react/components"
import React from 'react';
import {Select} from 'antd';
import {Flex} from 'reflexbox';
import {analytics_service} from "../../../../services/graphql";

const {Option} = Select;

export const ORGANIZATION_PROJECT_QUERY = gql`
  query getOrganizationProjects($organizationKey: String!){
    organization(key: $organizationKey) {
      id
      projects(interfaces:[ArchivedStatus]) {
          edges {
            node {
                id
                name
                key
                archived
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
                  <Flex style={{flexDirection: "column", paddingTop: '10px', paddingBottom: '8px' , alignContent: 'center'}}>
                    <div style={{fontSize: '14px', fontWeight: '500' , paddingRight: '10px'}}>Select Existing Project: </div>
                    <Select
                      className={'projects-selector'}
                      onChange={value => this.props.onProjectSelectChanged(value)}
                      placeholder={placeholder}
                      defaultValue={selectedProjectKey}
                      style={{width: 185}}
                    >
                      {
                        projects.filter(
                          project=>!project.node.archived
                        ).map(project =>
                          <Option key={project.node.key}
                                  value={project.node.key}>{project.node.name}
                          </Option>
                        )
                      }
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

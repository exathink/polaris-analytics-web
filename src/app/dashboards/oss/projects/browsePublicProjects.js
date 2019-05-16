import React from 'react';
import {Query} from 'react-apollo';
import gql from 'graphql-tag';
import {analytics_service} from "../../../services/graphql/index";
import {CardGrid} from "../../../components/cardGrid/index";
import {ProjectCard} from "../../../components/cards/projectCard";


export class BrowsePublicProjects extends React.Component {

  render() {
    return (
      <Query
        client={analytics_service}
        query={gql`
           query allPublicProjects {
                    public {
                        projects(interfaces: [NamedNode, RepositoryCount, OrganizationRef]) {
                            edges {
                                node {
                                  id
                                  name
                                  key
                                  repositoryCount
                                  organizationKey
                                  organizationName
                                }
                            }
                        }
                    }
               }
     `}
      >
        {
          ({loading, error, data}) => {
            if (loading) return <p> Loading.. </p>;
            if (error) return <p> Error: </p>;
            return (
              <CardGrid>
                {
                  data.public.projects.edges.map(
                    edge => (
                      <ProjectCard projectKey={edge.node.key} {...edge.node}/>
                    )
                  )
                }
              </CardGrid>
            );
          }
        }
      </Query>
    )
  }
}

export default BrowsePublicProjects;

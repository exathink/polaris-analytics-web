import React from 'react';
import {Query} from 'react-apollo';
import gql from 'graphql-tag';
import {admin_service} from "../../services/graphql";
import {CardGrid} from "../../components/cardGrid";
import {ProjectCard} from "../../components/cards/projectCard";


export class BrowsePublicProjects extends React.Component {

  render() {
    return (
      <Query
        client={admin_service}
        query={gql`
       {
         projectSummariesConnection(filter: all_public) {
          edges {
            node {
              id
              name
              projectKey
              organizationName
              organizationKey
              repoCount
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
                  data.projectSummariesConnection.edges.map(
                    edge => (
                      <ProjectCard {...edge.node}/>
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

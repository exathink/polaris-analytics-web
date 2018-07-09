import React from 'react';
import {Query} from 'react-apollo';
import gql from 'graphql-tag';
import {Link} from 'react-router-dom';
import {encodeInstance} from "../../framework/navigation/context/helpers";

export class BrowsePublicProjects extends React.Component {

  render() {
    return (
      <Query
        query={gql`
       {
         projects(allPublic: true) {
          edges {
            node {
              id
              name
              public
              projectKey
              organization {
                name
                organizationKey
              }
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
              <ul>
                {
                  data.projects.edges.map(
                    edge => (
                      <li key={edge.node.id}>
                        <Link to={`/app/dashboard/projects/${encodeInstance(edge.node.name, edge.node.projectKey)}`} >
                        {edge.node.name}
                        </Link>
                        <span>{edge.node.repoCount}</span>
                        <Link to={`/app/dashboard/organizations/${encodeInstance(edge.node.organization.name, edge.node.organization.organizationKey)}`}>
                          {edge.node.organization.name}
                        </Link>
                      </li>
                    )
                  )
                }
              </ul>
            );
          }
        }
      </Query>
    )
  }
}


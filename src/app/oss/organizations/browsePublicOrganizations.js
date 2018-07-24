import React from 'react';
import {Query} from 'react-apollo';
import gql from 'graphql-tag';
import {admin_service} from '../../services/graphql'

import {CardGrid} from "../../components/cardGrid";
import {OrganizationCard} from "../../components/cards";


export class BrowsePublicOrganizations extends React.Component {

  render() {
    return (
      <Query
        client={admin_service}
        query={gql`
       {
         organizationSummariesConnection(filter: all_public) {
          edges {
            node {
              id
              name
              organizationKey
              repoCount
              projectCount
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
                  data.organizationSummariesConnection.edges.map(
                    edge => (
                      <OrganizationCard {...edge.node}/>
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

export default BrowsePublicOrganizations;

import React from 'react';
import {Query} from 'react-apollo';
import gql from 'graphql-tag';

import {CardGrid, Card, CardImage, CardContent} from "../../components/cardGrid";
import {OrganizationCard} from "../../components/cards";


export class BrowsePublicOrganizations extends React.Component {

  render() {
    return (
      <Query
        query={gql`
       {
         organizations(allPublic: true) {
          edges {
            node {
              id
              name
              public
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
                  data.organizations.edges.map(
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

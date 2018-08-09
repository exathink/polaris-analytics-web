import React from 'react';
import {Query} from 'react-apollo';
import gql from 'graphql-tag';
import {analytics_service} from '../../services/graphql'

import {CardGrid} from "../../components/cardGrid";
import {OrganizationCard} from "../../components/cards";


export class BrowsePublicOrganizations extends React.Component {

  render() {
    return (
      <Query
        client={analytics_service}
        query={gql`
           query allPublicOrganizations {
                public {
                    organizations(interfaces: [NamedNode, ProjectCount, RepositoryCount]) {
                        edges {
                            node {
                              id
                              name
                              key
                              projectCount
                              repositoryCount
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
                  data.public.organizations.edges.map(
                    edge => (
                      <OrganizationCard organizationKey={edge.node.key} {...edge.node}/>
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

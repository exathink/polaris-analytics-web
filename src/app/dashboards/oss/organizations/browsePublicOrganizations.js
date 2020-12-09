import {gql} from "@apollo/client";
import {Query} from "@apollo/client/react/components"
import React from 'react';
import {analytics_service} from '../../../services/graphql/index'

import {CardGrid} from "../../../components/cardGrid/index";
import {OrganizationCard} from "../../../components/cards/index";


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

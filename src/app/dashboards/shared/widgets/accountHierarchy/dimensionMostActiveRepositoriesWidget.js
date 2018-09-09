import React from 'react';
import {Query} from 'react-apollo';
import gql from 'graphql-tag';
import {Loading} from "../../../../components/graphql/loading";
import {MostActiveChildrenView} from "../../views/mostActiveChildren";
import {analytics_service} from '../../../../services/graphql/index'

export const DimensionMostActiveRepositoriesWidget = (
  {
    dimension,
    instanceKey,
    context,
    childContext,
    top,
    days,
    view

  }) => (
    <Query
      client={analytics_service}
      query={
        gql`
            query ${dimension}_most_active_repositories($key: String!, $top: Int, $days: Int) {
                ${dimension}(key: $key){
                    id
                    recentlyActiveRepositories(first: $top, days: $days){
                        edges {
                            node {
                                key
                                name
                                commitCount
                            }
                        }

                    }
                }
            }
        `
      }
      variables={{
        key: instanceKey,
        top: top || 20,
        days: days || 7
      }}
    >
      {
        ({loading, error, data}) => {
          if (loading) return <Loading/>;
          if (error) return null;
          const repositories = data[dimension].recentlyActiveRepositories.edges.map(edge => edge.node);
          return (
            <MostActiveChildrenView
              context={context}
              childContext={childContext}
              activeChildren={repositories}
              view={view}
              top={top}
              days={days}
            />
          )
        }
      }
    </Query>
);
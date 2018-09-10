import React from 'react';
import {Query} from 'react-apollo';
import gql from 'graphql-tag';
import {Loading} from "../../../../components/graphql/loading";
import {MostActiveChildrenView} from "../../views/mostActiveChildren";
import {analytics_service} from '../../../../services/graphql/index'

export const DimensionMostActiveChildrenWidget = (
  {
    dimension,
    childConnection,
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
            query ${dimension}_${childConnection}($key: String!, $top: Int, $days: Int) {
                ${dimension}(key: $key){
                    id
                    ${childConnection}(first: $top, days: $days){
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
          const activeChildren = data[dimension][childConnection].edges.map(edge => edge.node);
          return (
            <MostActiveChildrenView
              context={context}
              childContext={childContext}
              activeChildren={activeChildren}
              view={view}
              top={top}
              days={days}
            />
          )
        }
      }
    </Query>
);
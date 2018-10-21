import React from 'react';
import {Query} from 'react-apollo';
import gql from 'graphql-tag';
import {Loading} from "../../../../components/graphql/loading";
import {MostActiveChildrenView} from "../../views/mostActiveChildren";
import {analytics_service} from '../../../../services/graphql/index'
import moment from 'moment';
import {toMoment} from "../../../../helpers/utility";

function getViewCacheKey(instanceKey, childConnection) {
  return `DimensionMostActiveChildren:${instanceKey}:${childConnection}`
}

export const DimensionMostActiveChildrenWidget = (
  {
    dimension,
    childConnection,
    instanceKey,
    context,
    childContext,
    top,
    before,
    latestCommit,
    days,
    view,
    pollInterval

  }) => (
    <Query
      client={analytics_service}
      query={
        gql`
            query ${dimension}_${childConnection}($key: String!, $top: Int, $before: DateTime, $days: Int) {
                ${dimension}(key: $key){
                    id
                    ${childConnection}(first: $top, before: $before, days: $days){
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
        days: days || 7,
        before: before ? moment(before) : latestCommit ? toMoment(latestCommit) : null,
      }}
      pollInterval={pollInterval || analytics_service.defaultPollInterval()}
    >
      {
        ({loading, error, data}) => {
          const viewCacheKey = getViewCacheKey(instanceKey, childConnection);
          if (loading) return context.getCachedView(viewCacheKey) || <Loading/>;
          if (error) return null;
          const activeChildren = data[dimension][childConnection].edges.map(edge => edge.node);
          context.cacheView(viewCacheKey, (
            <MostActiveChildrenView
              context={context}
              childContext={childContext}
              activeChildren={activeChildren}
              view={view}
              top={top}
              before={before}
              latestCommit={latestCommit}
              days={days}
              onSelectionChange={
                (children) => {
                  onChildrenSelected(context, childContext, children)
                }
              }
            />
          )
          );
          return context.getCachedView(viewCacheKey);
        }
      }
    </Query>
);

function onChildrenSelected(context, childContext, children) {
  if(children.length === 1) {
    const child = children[0];
    context.navigate(childContext, child.name, child.key)
  }
}
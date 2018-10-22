import React from 'react';
import {Query} from 'react-apollo';
import gql from 'graphql-tag';
import {Loading} from "../../../../components/graphql/loading";
import {Contexts} from "../../../../meta";
import {analytics_service} from '../../../../services/graphql/index'
import {ActivityLevelDetailModel, ActivityLevelDetailView, ActivityLevelSummaryView} from "../../views/activityProfile";

function getViewCacheKey(dimension, childDimension, instanceKey) {
  return `ActivityProfileWidget:${dimension}:${childDimension}:${instanceKey}`
}

export const ChildDimensionActivityProfileWidget = (
  {
    dimension,
    instanceKey,
    childDimension,
    view,
    pageSize,
    pollInterval,
    referenceDate,
    ...rest
  }) => (
  <Query
    client={analytics_service}
    query={
      gql`
       query ${dimension}${childDimension}ActivitySummaries($key: String!, $pageSize: Int, $referenceDate: DateTime){
          ${dimension}(key: $key){
              id
              ${childDimension}(referenceDate: $referenceDate, first: $pageSize, summaries: [ActivityLevelSummary] interfaces: [CommitSummary, ContributorCount]) {
                count
                activityLevelSummary {
                    activeCount
                    quiescentCount
                    dormantCount
                    inactiveCount
                }
                edges{
                    node {
                      id
                      ... on NamedNode{
                        name
                        key
                      }
                      ... on CommitSummary{
                          earliestCommit
                          latestCommit
                          commitCount
                      }
                      ... on ContributorCount {
                        contributorCount
                      }
                    }
                }
              }
          }
       }
    `}
    variables={{key: instanceKey, ...{pageSize, referenceDate}}}
  >
    {
      ({loading, error, data}) => {
        const {context} = rest;
        const viewCacheKey = getViewCacheKey(dimension, childDimension, instanceKey);

        if (loading) return context.getCachedView(viewCacheKey) || <Loading/>;
        if (error) return null;
        const model = ActivityLevelDetailModel.initModelFromCommitSummaries(
          instanceKey,
          data[dimension][childDimension].edges.map(edge => edge.node),
          data[dimension][childDimension].count,
          data[dimension][childDimension].activityLevelSummary,
          'contributorCount',
          Contexts.contributors,
          dimension,
          childDimension,
          rest
        );
        context.cacheView(viewCacheKey, (
            view && view === 'detail' ?
              <ActivityLevelDetailView
                model={model}
                {...rest}
              /> :
              <ActivityLevelSummaryView
                model={model}
                {...rest}
              />
          )
        );
        return context.getCachedView(viewCacheKey);
      }
    }
  </Query>
);
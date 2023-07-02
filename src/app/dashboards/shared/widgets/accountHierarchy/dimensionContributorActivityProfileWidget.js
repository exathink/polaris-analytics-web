import {gql} from "@apollo/client";
import {Query} from "@apollo/client/react/components"
import React from 'react';
import {Loading} from "../../../../components/graphql/loading";
import {Contexts} from "../../../../meta";
import {analytics_service} from '../../../../services/graphql/index'
import {ActivityLevelDetailModel} from "../../views/activityProfile/index";
import {ActivityLevelSummaryView} from "../../views/activityProfile/activityLevelSummaryView";
import {ActivityLevelDetailView} from "../../views/activityProfile/activityLevelDetailView";

function getViewCacheKey(instanceKey) {
  return `ContributorActivityProfile:${instanceKey}`;
}

export const DimensionContributorActivityProfileWidget = (
  {
    dimension,
    instanceKey,
    view,
    pollInterval,
    pageSize,
    referenceDate,
    ...rest
  }) => (
  <Query
    client={analytics_service}
    query={
      gql`
       query ${dimension}ContributorActivitySummaries($key: String!, $pageSize: Int, $referenceDate: DateTime){
          ${dimension}(key: $key){
              id
              contributors(first:$pageSize, referenceDate: $referenceDate, 
              summaries:[ActivityLevelSummary], 
              interfaces: [CommitSummary, RepositoryCount], 
              commitWithinDays: 90
              ) {
                count
                activityLevelSummary {
                    activeCount
                    quiescentCount
                    dormantCount
                    inactiveCount
                }
                edges{
                    node {
                      ... on NamedNode{
                        name
                        key
                      }
                      ... on CommitSummary{
                          earliestCommit
                          latestCommit
                          commitCount
                      }
                      ... on RepositoryCount {
                        repositoryCount
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
        const viewCacheKey = getViewCacheKey(instanceKey);

        if (loading) return context.getCachedView(viewCacheKey) || <Loading/>;
        if (error) return null;
        const model = ActivityLevelDetailModel.initModelFromCommitSummaries(
          instanceKey,
          data[dimension].contributors.edges.map(edge => edge.node),
          data[dimension].contributors.count,
          data[dimension].contributors.activityLevelSummary,
          'repositoryCount',
          Contexts.repositories,
          dimension,
          'contributors',
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
        )
        return context.getCachedView(viewCacheKey)
      }
    }
  </Query>
);
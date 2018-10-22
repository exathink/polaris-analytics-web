import React from 'react';

import {Query} from 'react-apollo';
import gql from 'graphql-tag';
import {Loading} from "../../../../components/graphql/loading";
import {analytics_service} from '../../../../services/graphql/index'

import {WeeklyContributorCountChart} from "../../views/weeklyContributorCounts";

function getViewCacheKey(instanceKey, dimension) {
  return `WeeklyContributorCount:${instanceKey}:${dimension}`;
}

export const DimensionWeeklyContributorCountWidget = (
  {
    dimension,
    instanceKey,
    context,
    view,
    referenceDate,

  }) => (
  <Query
    client={analytics_service}
    query={
      gql`
            query ${dimension}_weekly_contributor_count($key: String!, $referenceDate: DateTime) {
                ${dimension}(key: $key, referenceDate: $referenceDate){
                    id
                    weeklyContributorCounts{
                        year
                        week
                        contributorCount
                    }
                }
            }
        `
    }
    variables={{
      key: instanceKey,
      referenceDate: referenceDate,
    }}
  >
    {
      ({loading, error, data}) => {
        const viewCacheKey = getViewCacheKey(instanceKey, dimension);

        if (loading) return context.getCachedView(viewCacheKey) || <Loading/>;
        if (error) return null;
        const weeklyContributorCounts = data[dimension].weeklyContributorCounts;
        context.cacheView(viewCacheKey, (
            <WeeklyContributorCountChart
              weeklyContributorCounts={weeklyContributorCounts}
              context={context}
            />
          )
        )
        return context.getCachedView(viewCacheKey);
      }
    }
  </Query>
);

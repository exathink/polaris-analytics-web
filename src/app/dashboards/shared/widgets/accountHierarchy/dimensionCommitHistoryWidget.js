import {gql} from "@apollo/client";
import {Query} from "@apollo/client/react/components"
import React from 'react';

import {Loading} from "../../../../components/graphql/loading";
import {CumulativeCommitCountChart, CommitHistoryDetailView} from "../../views/commitHistory";
import {analytics_service} from '../../../../services/graphql/index'

function getViewCacheKey(instanceKey, dimension) {
  return `CommitHistoryWidget:${instanceKey}:${dimension}`;
}

export const DimensionCommitHistoryWidget = (
  {
    dimension,
    instanceKey,
    context,
    view,
    detailViewGroupings,
    detailViewCommitsGroupBy,
    referenceDate,

  }) => (
  <Query
    client={analytics_service}
    query={
      gql`
            query ${dimension}_cumulative_commit_count($key: String!, $referenceDate: DateTime) {
                ${dimension}(key: $key, referenceDate: $referenceDate){
                    id
                    cumulativeCommitCount{
                        year
                        week
                        cumulativeCommitCount
                    }
                }
            }
        `
    }
    variables={{
      key: instanceKey,
      referenceDate: referenceDate
    }}
  >
    {
      ({loading, error, data}) => {
        const viewCacheKey = getViewCacheKey(instanceKey, dimension);

        if (loading) return context.getCachedView(viewCacheKey) || <Loading/>;
        if (error) return null;
        const cumulativeCommitCounts = data[dimension].cumulativeCommitCount;
        context.cacheView(viewCacheKey, (
            view === 'detail' ?
              <CommitHistoryDetailView
                cumulativeCommitCounts={cumulativeCommitCounts}
                context={context}
                dimension={dimension}
                instanceKey={instanceKey}
                view={view}
                detailViewGroupings={detailViewGroupings}
                detailViewCommitsGroupBy={detailViewCommitsGroupBy}
                referenceDate={referenceDate}
              />
              :
              <CumulativeCommitCountChart
                cumulativeCommitCounts={cumulativeCommitCounts}
                context={context}
                view={view}
              />

          )
        )
        return context.getCachedView(viewCacheKey)
      }
    }
  </Query>
);

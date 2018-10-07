import React from 'react';

import {Query} from 'react-apollo';
import gql from 'graphql-tag';
import {Loading} from "../../../../components/graphql/loading";
import {CumulativeCommitCountChart, CumulativeCommitCountDetailView} from "../../views/commitHistory";
import {analytics_service} from '../../../../services/graphql/index'


export const DimensionCommitHistoryWidget = (
  {
    dimension,
    instanceKey,
    context,
    view,
    detailViewCommitsGroupBy

  }) => (
    <Query
      client={analytics_service}
      query={
        gql`
            query ${dimension}_cumulative_commit_count($key: String!) {
                ${dimension}(key: $key){
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
        key: instanceKey
      }}
    >
      {
        ({loading, error, data}) => {
          if (loading) return <Loading/>;
          if (error) return null;
          const cumulativeCommitCounts = data[dimension].cumulativeCommitCount;
          return (
            view == 'detail' ?
              <CumulativeCommitCountDetailView
                cumulativeCommitCounts={cumulativeCommitCounts}
                context={context}
                dimension={dimension}
                instanceKey={instanceKey}
                view={view}
                detailViewCommitsGroupBy={detailViewCommitsGroupBy}
              />
              :
              <CumulativeCommitCountChart
                cumulativeCommitCounts={cumulativeCommitCounts}
                context={context}
                view={view}
              />

          )
        }
      }
    </Query>
);

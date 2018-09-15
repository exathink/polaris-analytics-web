import React from 'react';

import {Query} from 'react-apollo';
import gql from 'graphql-tag';
import {Loading} from "../../../../components/graphql/loading";
import {CumulativeCommitCountChart} from "../../views/cumulativeCommitCount";
import {analytics_service} from '../../../../services/graphql/index'


export const DimensionCumulativeCommitCountWidget = (
  {
    dimension,
    instanceKey,
    context,
    view

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
            <CumulativeCommitCountChart
              cumulativeCommitCounts={cumulativeCommitCounts}
              context={context}
            />
          )
        }
      }
    </Query>
);

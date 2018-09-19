import React from 'react';

import {Query} from 'react-apollo';
import gql from 'graphql-tag';
import {Loading} from "../../../../components/graphql/loading";
import {analytics_service} from '../../../../services/graphql/index'

import {WeeklyContributorCountChart} from "../../views/weeklyContributorCounts";

export const DimensionWeeklyContributorCountWidget = (
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
            query ${dimension}_weekly_contributor_count($key: String!) {
                ${dimension}(key: $key){
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
        key: instanceKey
      }}
    >
      {
        ({loading, error, data}) => {
          if (loading) return <Loading/>;
          if (error) return null;
          const weeklyContributorCounts = data[dimension].weeklyContributorCounts;
          return (
            <WeeklyContributorCountChart
              weeklyContributorCounts={weeklyContributorCounts}
              context={context}
            />
          )
        }
      }
    </Query>
);

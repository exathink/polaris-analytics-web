import React from 'react';
import {Query} from 'react-apollo';
import gql from 'graphql-tag';
import {Loading} from "../../../../components/graphql/loading";

import {RepositoryCount} from "../../../../graphql/analytics/interfaces.graphql";

import {analytics_service} from '../../../../services/graphql'
import {CommitSummaryPanel} from "../../../widgets/activity/ActivitySummary/view";


export const GqlView = (
  {
    client,
    query,
    variables,
    dataMapper,
    pollInterval,
    View
  }) => {
      return <Query
        client={client}
        query={query}
        variables={variables}
        errorPolicy={'all'}
        pollInterval={pollInterval || 0}
      >
        {
          ({loading, error, data}) => {
            if (loading) return <Loading/>;
            if (error) return null;
            return <View {...dataMapper(data)}/>
          }
        }
      </Query>
}
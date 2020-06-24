import React from 'react';
import {Query} from 'react-apollo';
import gql from 'graphql-tag';
import {Loading} from "../../../components/graphql/loading";

import {analytics_service} from '../../../services/graphql'
import {
  ActivityLevelDetailModel,
  ActivityLevelDetailView,
  ActivityLevelSummaryView
} from "../../shared/views/activityProfile";

export const ContributorRepositoriesActivityProfileWidget = (
  {
    instanceKey,
    dimension,
    childDimension,
    view,
    referenceDate,
    ...rest
  }) => {
  return <Query
    client={analytics_service}
    query={
      gql`
               query ContributorRepositoriesActivityProfile($key: String!, $referenceDate: DateTime) {
                contributor(key: $key, referenceDate: $referenceDate) {
                    id
                    repositoriesActivitySummary {
                        id
                        name
                        key
                        earliestCommit
                        latestCommit
                        commitCount
                    }
                }
               }
          `}
    variables={{key: instanceKey, ...{referenceDate}}}
    errorPolicy={'all'}
  >
    {
      ({loading, error, data}) => {
        if (loading) return <Loading/>;
        if (error) return null;
        const activitySummaries = data.contributor.repositoriesActivitySummary;
        const model = ActivityLevelDetailModel.initModelFromCommitSummaries(
          instanceKey, activitySummaries, activitySummaries.length, null, null, null, dimension, childDimension, rest
        );
        return (
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
      }
    }
  </Query>;
};





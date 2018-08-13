import React from 'react';
import {Query} from 'react-apollo';
import gql from 'graphql-tag';
import {Loading} from "../../../components/graphql/loading";

import {analytics_service} from '../../../services/graphql'
import {ActivitySummaryPanel} from "../../shared/views/activitySummary";
import {Contexts} from "../../../meta";

export const ContributorActivitySummaryWidget = (
  {
    instanceKey,
    pollInterval
  }) => {
      return <Query
        client={analytics_service}
        query={
          gql`
               query ContributorCommitSummary($key: String!) {
                contributor(key: $key, interfaces: [CommitSummary, RepositoryCount]) {
                    id
                    ... on CommitSummary {
                        earliestCommit
                        latestCommit
                        commitCount
                    }
                    ... on RepositoryCount {
                        repositoryCount
                    }
                }
               }
          `}
        variables={{key: instanceKey}}
        errorPolicy={'all'}
        pollInterval={pollInterval || analytics_service.defaultPollInterval()}
      >
        {
          ({loading, error, data}) => {
            if (loading) return <Loading/>;
            if (error) return null;
            const {repositoryCount, ...commitSummary} = data.contributor;
            return(
                <ActivitySummaryPanel
                  model={
                    {
                      ...commitSummary,
                      secondaryMeasure: repositoryCount
                    }
                  }
                  secondaryMeasureContext={Contexts.repositories}
                />
            )

          }
        }
      </Query>;
};





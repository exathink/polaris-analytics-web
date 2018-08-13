import React from 'react';
import {Query} from 'react-apollo';
import gql from 'graphql-tag';
import {Loading} from "../../../../components/graphql/loading";
import {analytics_service} from '../../../../services/graphql/index';
import {ContributorSummary} from '../../../../graphql/analytics/interfaces.graphql';
import {ActivitySummaryPanel} from "../../views/activitySummary";
import {Contexts} from "../../../../meta/index";


export const DimensionActivitySummaryPanelWidget = (
  {
    dimension,
    instanceKey,
    pollInterval
  }) => (
  <Query
    client={analytics_service}
    query={
      gql`
           query ${dimension}CommitSummary($key: String!) {
            ${dimension}(key: $key, interfaces: [CommitSummary, ContributorSummary]) {
                id
                ... on CommitSummary {
                    earliestCommit
                    latestCommit
                    commitCount
                }
                ... on ContributorSummary {
                    contributorCount
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
        const {contributorCount, ...commitSummary} = data[dimension];
            return(
                <ActivitySummaryPanel
                  model={
                    {
                      ...commitSummary,
                      secondaryMeasure: contributorCount
                    }
                  }
                  secondaryMeasureContext={Contexts.contributors}
                />
            )

      }
    }
  </Query>
);




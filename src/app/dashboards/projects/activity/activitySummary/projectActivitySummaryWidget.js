import React from 'react';
import {Query} from 'react-apollo';
import gql from 'graphql-tag';
import {Loading} from "../../../../components/graphql/loading";
import {analytics_service} from "../../../../services/graphql";
import {ActivitySummaryPanel} from "./activitySummaryPanelView";
import {Contexts} from "../../../../meta";


export const ProjectActivitySummaryWidget = (
  {
    instanceKey,
    contributorCountDays,
    pollInterval
  }) => (
  <Query
    client={analytics_service}
    query={
      gql`
           query projectActivitySummary($key: String!, $contributorCountDays: Int) {
            project(key: $key, interfaces: [CommitSummary, ContributorCount], 
                    contributorCountDays: $contributorCountDays
                    ) {
                id
                ... on CommitSummary {
                    earliestCommit
                    latestCommit
                    commitCount
                }
                ... on ContributorCount {
                    contributorCount
                }
            }
           }
      `}
    variables={{key: instanceKey, contributorCountDays: contributorCountDays}}
    errorPolicy={'all'}
    pollInterval={pollInterval || analytics_service.defaultPollInterval()}
  >
    {
      ({loading, error, data}) => {
        if (loading) return <Loading/>;
        if (error) return null;
        const {contributorCount, ...commitSummary} = data['project'];
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




import React from 'react';
import {useQuery} from '@apollo/react-hooks';
import gql from 'graphql-tag';
import {Loading} from "../../../../components/graphql/loading";
import {analytics_service} from "../../../../services/graphql";
import {ActivitySummaryPanel} from "./activitySummaryPanelView";


export const ProjectActivitySummaryWidget = (
  {
    instanceKey,
    days,
    pollInterval
  }) => {

  const {loading, error, data} = useQuery(
    gql`
           query projectActivitySummary($key: String!, $days: Int) {
            project(key: $key, interfaces: [CommitSummary], contributorCountDays: $days) {
                
                ... on ContributorCount {
                    contributorCount
                }
                ... on CommitSummary {
                    latestCommit
                }
            }
           }
      `, {

      service: analytics_service,
      variables: {
        key: instanceKey,
        days: days
      },
      errorPolicy: "all",
      pollInterval: pollInterval || analytics_service.defaultPollInterval()
    }
  );

  if (loading) return <Loading/>;
  if (error) return null;
  const {contributorCount, ...commitSummary} = data['project'];
  return (
    <ActivitySummaryPanel
      model={
        {
          contributorCount,
          ...commitSummary
        }
      }
      days={days}
    />
  )
}






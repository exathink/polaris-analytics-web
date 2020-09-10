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
    specsOnly,
    pollInterval
  }) => {

  const {loading, error, data} = useQuery(
    gql`
           query projectActivitySummary($key: String!, $days: Int, $specsOnly: Boolean) {
            project(key: $key, interfaces: [CommitSummary, ContributorCount, DeliveryCycleSpan], contributorCountDays: $days, specsOnly: $specsOnly) {
                
                latestClosedDate
                
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
        days: days,
        specsOnly: specsOnly
      },
      errorPolicy: "all",
      pollInterval: pollInterval || analytics_service.defaultPollInterval()
    }
  );

  if (loading) return <Loading/>;
  if (error) return null;
  const {contributorCount, latestClosedDate,  ...commitSummary} = data['project'];
  return (
    <ActivitySummaryPanel
      model={
        {

          contributorCount,
          latestClosedDate,
          ...commitSummary
        }
      }
      days={days}
    />
  )
}






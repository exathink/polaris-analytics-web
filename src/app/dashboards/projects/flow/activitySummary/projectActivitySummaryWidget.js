import React from 'react';
import {useQuery} from '@apollo/react-hooks';
import gql from 'graphql-tag';
import {Loading} from "../../../../components/graphql/loading";
import {analytics_service} from "../../../../services/graphql";
import {ActivitySummaryPanel} from "./activitySummaryPanelView";

import {getReferenceString} from "../../../../helpers/utility";

export const ProjectActivitySummaryWidget = (
  {
    instanceKey,
    days,
    specsOnly,
    latestWorkItemEvent,
    latestCommit,
    pollInterval
  }) => {

  const {loading, error, data} = useQuery(
    gql`
           query projectActivitySummary($key: String!, $days: Int, $specsOnly: Boolean, $referenceString: String) {
            project(key: $key, interfaces: [ContributorCount], contributorCountDays: $days, specsOnly: $specsOnly, referenceString: $referenceString) {
                contributorCount
            }
           }
      `, {

      service: analytics_service,
      variables: {
        key: instanceKey,
        days: days,
        specsOnly: specsOnly,
        referenceString: getReferenceString(latestCommit, latestWorkItemEvent),
      },
      errorPolicy: "all",
      pollInterval: pollInterval || analytics_service.defaultPollInterval()
    }
  );

  if (loading) return <Loading/>;
  if (error) return null;
  const {contributorCount} = data['project'];
  return (
    <ActivitySummaryPanel
      model={
        {

          contributorCount,

        }
      }
      latestCommit={latestCommit}
      days={days}
    />
  )
}






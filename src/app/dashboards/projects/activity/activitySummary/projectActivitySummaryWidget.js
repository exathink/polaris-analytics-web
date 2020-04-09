import React from 'react';
import {useQuery} from '@apollo/react-hooks';
import gql from 'graphql-tag';
import {Loading} from "../../../../components/graphql/loading";
import {analytics_service} from "../../../../services/graphql";
import {ActivitySummaryPanel} from "./activitySummaryPanelView";


export const ProjectActivitySummaryWidget = (
  {
    instanceKey,
    pollInterval
  }) => {

  const {loading, error, data} = useQuery(
    gql`
           query projectActivitySummary($key: String!) {
            project(key: $key, interfaces: [CommitSummary]) {
                id
                ... on CommitSummary {
                    latestCommit
                }
            }
           }
      `, {

      service: analytics_service,
      variables: {
        key: instanceKey,
      },
      errorPolicy: "all",
      pollInterval: pollInterval || analytics_service.defaultPollInterval()
    }
  );

  if (loading) return <Loading/>;
  if (error) return null;
  const {...commitSummary} = data['project'];
  return (
    <ActivitySummaryPanel
      model={
        {
          ...commitSummary,
        }
      }
    />
  )
}






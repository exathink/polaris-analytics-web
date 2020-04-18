import React from 'react';
import {useQuery} from '@apollo/react-hooks';
import gql from 'graphql-tag';
import {Loading} from "../../../../components/graphql/loading";
import {analytics_service} from "../../../../services/graphql";

import {ProjectDefectMetricsSummaryView} from "./projectDefectMetricsSummaryView";


export const ProjectDefectMetricsWidget = (
  {
    instanceKey,
    days,
    targetPercentile,
    latestWorkItemEvent,
    stateMappingIndex,
    showAll,
    pollInterval
  }) => {

  const {loading, error, data} = useQuery(
    gql`
           query projectDefectMetricsSummary($key: String!, $days: Int!, $targetPercentile: Float!, $referenceString: String!) {
            project(key: $key, 
                    interfaces: [AggregateCycleMetrics, WorkItemStateTypeCounts], 
                    defectsOnly: true,
                    cycleMetricsTargetPercentile: $targetPercentile,
                    closedWithinDays: $days,
                    referenceString: $referenceString, 
                    ) {
                
                ... on AggregateCycleMetrics {
                    minLeadTime
                    avgLeadTime
                    maxLeadTime
                    percentileLeadTime
                    minCycleTime
                    avgCycleTime
                    maxCycleTime
                    percentileCycleTime
                    workItemsInScope
                    targetPercentile
                }
                ... on WorkItemStateTypeCounts {
                  workItemStateTypeCounts {
                    backlog
                  }
                }
            }
           }
      `, {

      service: analytics_service,
      variables: {
        key: instanceKey,
        days: days,
        targetPercentile: targetPercentile,
        referenceString: latestWorkItemEvent

      },
      errorPolicy: "all",
      pollInterval: pollInterval || analytics_service.defaultPollInterval()
    }
  );

  if (loading) return <Loading/>;
  if (error) return null;
  const {...projectDefectMetrics} = data['project'];
  return (
    <ProjectDefectMetricsSummaryView
      instanceKey={instanceKey}
      showAll={showAll}
      stateMappingIndex={stateMappingIndex}
      {...projectDefectMetrics}
    />
  )
}






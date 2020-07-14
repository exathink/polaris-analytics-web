import {useQuery} from "@apollo/react-hooks";
import gql from "graphql-tag";
import {analytics_service} from "../../../../services/graphql";

export function useQueryProjectFlowMetricsTrends(
  {
    instanceKey,
    before,
    days,
    measurementWindow,
    samplingFrequency,
    targetPercentile,
    referenceString
  }) {
  return useQuery(
    gql`
     query projectFlowMetricsTrends(
          $key: String!, 
          $days: Int!,
          $measurementWindow: Int!,
          $samplingFrequency: Int!,
          $targetPercentile: Float!,
          $before: DateTime,
          $referenceString: String, 
          ) {
      project(
            key: $key, 
            interfaces: [CycleMetricsTrends],
            cycleMetricsTrendsArgs: {
              before: $before,
              days: $days,
              measurementWindow: $measurementWindow,
              samplingFrequency: $samplingFrequency,
              leadTimeTargetPercentile: $targetPercentile,
              cycleTimeTargetPercentile: $targetPercentile,
              metrics: [avg_lead_time, avg_cycle_time]
            },
            referenceString: $referenceString,
            ) {
            cycleMetricsTrends {   
                measurementDate     
                avgLeadTime
                avgCycleTime
                workItemsWithNullCycleTime
                workItemsInScope
                earliestClosedDate
                latestClosedDate
            }
        }
     }
  `,
    {
      service: analytics_service,
      variables: {
        key: instanceKey,
        days: days,
        before: before,
        measurementWindow: measurementWindow,
        samplingFrequency: samplingFrequency,
        targetPercentile: targetPercentile,
        referenceString: referenceString
      },
      errorPolicy: "all",
      pollInterval: analytics_service.defaultPollInterval()
    }
  )
}
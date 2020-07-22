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
    specsOnly,
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
          $specsOnly: Boolean, 
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
              metrics: [
                avg_lead_time, 
                min_cycle_time,
                q1_cycle_time, 
                median_cycle_time, 
                q3_cycle_time, 
                max_cycle_time,
                percentile_cycle_time,
                avg_cycle_time,
                percentile_lead_time, 
                max_lead_time,
                work_items_in_scope,
                work_items_with_commits, 
                work_items_with_null_cycle_time
              ],
              specsOnly: $specsOnly
            },
            referenceString: $referenceString,
            ) {
            cycleMetricsTrends {   
                measurementDate     
                avgLeadTime
                minCycleTime
                q1CycleTime
                medianCycleTime
                q3CycleTime
                percentileCycleTime
                maxCycleTime
                avgCycleTime
                percentileLeadTime
                maxLeadTime
                workItemsWithNullCycleTime
                workItemsInScope
                workItemsWithCommits
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
        referenceString: referenceString,
        specsOnly: specsOnly
      },
      errorPolicy: "all",
      pollInterval: analytics_service.defaultPollInterval()
    }
  )
}
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
    leadTimeTargetPercentile,
    cycleTimeTargetPercentile,
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
          $leadTimeTargetPercentile: Float!,
          $cycleTimeTargetPercentile: Float!,
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
              leadTimeTargetPercentile: $leadTimeTargetPercentile,
              cycleTimeTargetPercentile: $cycleTimeTargetPercentile,
              durationTargetPercentile: $cycleTimeTargetPercentile,
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
                total_effort,
                avg_effort,
                max_effort,
                avg_duration,
                max_duration,
                avg_latency,
                max_latency,
                percentile_latency,
                percentile_duration,
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
                totalEffort
                avgEffort
                maxEffort
                avgDuration
                maxDuration
                percentileDuration
                avgLatency
                maxLatency
                percentileLatency
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

        leadTimeTargetPercentile: leadTimeTargetPercentile || targetPercentile,
        cycleTimeTargetPercentile: cycleTimeTargetPercentile || targetPercentile,
        referenceString: referenceString,
        specsOnly: specsOnly
      },
      errorPolicy: "all",
      pollInterval: analytics_service.defaultPollInterval()
    }
  )
}
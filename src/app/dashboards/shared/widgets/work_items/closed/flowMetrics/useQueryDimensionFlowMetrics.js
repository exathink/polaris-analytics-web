import { useQuery, gql } from "@apollo/client";
import {analytics_service} from "../../../../../../services/graphql";


export function useQueryDimensionFlowMetrics(
  {
    dimension, instanceKey, tags, days, measurementWindow, samplingFrequency, leadTimeTarget, leadTimeTargetPercentile,
    cycleTimeTarget, cycleTimeTargetPercentile, specsOnly, includeSubTasks, referenceString
  }
) {
  return useQuery(
    gql`
        query ${dimension}FlowMetrics(
            $key: String!,
            $tags: [String],
            $days: Int!,
            $measurementWindow: Int!,
            $samplingFrequency: Int!,
            $leadTimeTargetPercentile: Float,
            $cycleTimeTargetPercentile: Float,
            $specsOnly: Boolean,
            $includeSubTasks: Boolean,
            $referenceString: String

        ) {
            ${dimension}(
                key: $key,
                tags: $tags,
                interfaces: [CycleMetricsTrends, ContributorCount],
                cycleMetricsTrendsArgs: {
                    days: $days,
                    measurementWindow: $measurementWindow,
                    samplingFrequency: $samplingFrequency,
                    leadTimeTargetPercentile: $leadTimeTargetPercentile,
                    cycleTimeTargetPercentile: $cycleTimeTargetPercentile,
                    durationTargetPercentile: $cycleTimeTargetPercentile,
                    latencyTargetPercentile: $cycleTimeTargetPercentile,
                    specsOnly: $specsOnly,
                    includeSubTasks: $includeSubTasks,
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
                        percentile_effort,
                        max_effort,
                        avg_duration,
                        max_duration,
                        avg_latency,
                        max_latency,
                        percentile_latency,
                        percentile_duration,
                        work_items_in_scope,
                        work_items_with_commits,
                        work_items_with_null_cycle_time,
                        cadence
                    ]
                }
                contributorCountDays: $days
                referenceString: $referenceString

            ) {
                cycleMetricsTrends {
                    measurementDate
                    measurementWindow
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
                    percentileEffort
                    avgEffort
                    maxEffort
                    avgDuration
                    maxDuration
                    percentileDuration
                    avgLatency
                    maxLatency
                    percentileLatency
                    workItemsWithNullCycleTime
                    cadence
                    workItemsInScope
                    workItemsWithCommits
                    earliestClosedDate
                    latestClosedDate
                    targetPercentile
                }
                contributorCount
            }
        }
    `, {

      service: analytics_service,
      variables: {
        key: instanceKey,
        tags: tags,
        days: days,
        measurementWindow: measurementWindow,
        samplingFrequency: samplingFrequency,

        leadTimeTargetPercentile: leadTimeTargetPercentile,

        cycleTimeTargetPercentile: cycleTimeTargetPercentile,
        specsOnly: specsOnly,
        includeSubTasks: includeSubTasks,
        referenceString: referenceString
      },
      errorPolicy: "all",
      pollInterval: analytics_service.defaultPollInterval()
    }
  );
}
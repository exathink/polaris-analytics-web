import {useQuery} from "@apollo/react-hooks";
import gql from "graphql-tag";
import {analytics_service} from "../../../../services/graphql";


export function useQueryProjectFlowMetrics(
  {
    instanceKey, days, measurementWindow, samplingFrequency, leadTimeTarget, leadTimeTargetPercentile,
    cycleTimeTarget, cycleTimeTargetPercentile, specsOnly, referenceString
  }
) {
  return useQuery(
    gql`
        query projectFlowMetrics(
            $key: String!,
            $days: Int!,
            $measurementWindow: Int!,
            $samplingFrequency: Int!,
            $leadTimeTarget: Int!,
            $leadTimeTargetPercentile: Float!,
            $cycleTimeTarget: Int!,
            $cycleTimeTargetPercentile: Float!,
            $specsOnly: Boolean,
            $referenceString: String

        ) {
            project(
                key: $key,
                interfaces: [ResponseTimeConfidenceTrends, CycleMetricsTrends],
                responseTimeConfidenceTrendsArgs: {
                    days: $days,
                    measurementWindow: $measurementWindow,
                    samplingFrequency: $samplingFrequency,
                    leadTimeTarget : $leadTimeTarget,
                    cycleTimeTarget: $cycleTimeTarget,
                    specsOnly: $specsOnly,
                },
                cycleMetricsTrendsArgs: {
                    days: $days,
                    measurementWindow: $measurementWindow,
                    samplingFrequency: $samplingFrequency,
                    leadTimeTargetPercentile: $leadTimeTargetPercentile,
                    cycleTimeTargetPercentile: $cycleTimeTargetPercentile,
                    durationTargetPercentile: $cycleTimeTargetPercentile,
                    latencyTargetPercentile: $cycleTimeTargetPercentile,
                    specsOnly: $specsOnly,
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

                referenceString: $referenceString

            ) {

                responseTimeConfidenceTrends {
                    measurementDate
                    leadTimeTarget
                    leadTimeConfidence
                    cycleTimeTarget
                    cycleTimeConfidence
                }
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
            }
        }
    `, {

      service: analytics_service,
      variables: {
        key: instanceKey,
        days: days,
        measurementWindow: measurementWindow,
        samplingFrequency: samplingFrequency,
        leadTimeTarget: leadTimeTarget,
        leadTimeTargetPercentile: leadTimeTargetPercentile,
        cycleTimeTarget: cycleTimeTarget,
        cycleTimeTargetPercentile: cycleTimeTargetPercentile,
        specsOnly: specsOnly,
        referenceString: referenceString
      },
      errorPolicy: "all",
      pollInterval: analytics_service.defaultPollInterval()
    }
  );
}
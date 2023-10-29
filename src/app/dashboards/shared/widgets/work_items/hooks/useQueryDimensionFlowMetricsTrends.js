import {useQuery, gql} from "@apollo/client";
import {analytics_service} from "../../../../../services/graphql";

export const getFlowMetricsTrendsQuery = (dimension) => gql`
  query ${dimension}FlowMetricsTrends(
    $key: String!
    $tags: [String]
    $release: String
    $days: Int!
    $measurementWindow: Int!
    $samplingFrequency: Int!
    $leadTimeTargetPercentile: Float!
    $cycleTimeTargetPercentile: Float!
    $before: Date
    $specsOnly: Boolean
    $referenceString: String
    $defectsOnly: Boolean
    $includeSubTasks: Boolean
  ) {
    ${dimension}(
      key: $key
      tags: $tags
      release: $release,
      interfaces: [CycleMetricsTrends, ArrivalDepartureTrends]
      arrivalDepartureTrendsArgs: {
        days: $days,
        measurementWindow: $measurementWindow,
        samplingFrequency: $samplingFrequency,
        specsOnly: $specsOnly, 
        metric: wip_arrivals_departures
      }
      cycleMetricsTrendsArgs: {
        before: $before
        days: $days
        measurementWindow: $measurementWindow
        samplingFrequency: $samplingFrequency
        leadTimeTargetPercentile: $leadTimeTargetPercentile
        cycleTimeTargetPercentile: $cycleTimeTargetPercentile
        durationTargetPercentile: $cycleTimeTargetPercentile
        latencyTargetPercentile: $cycleTimeTargetPercentile
        defectsOnly: $defectsOnly
        includeSubTasks: $includeSubTasks
        metrics: [
          avg_lead_time
          min_cycle_time
          q1_cycle_time
          median_cycle_time
          q3_cycle_time
          max_cycle_time
          percentile_cycle_time
          avg_cycle_time
          percentile_lead_time
          max_lead_time
          total_effort
          avg_effort
          percentile_effort
          max_effort
          avg_duration
          max_duration
          avg_latency
          max_latency
          percentile_latency
          percentile_duration
          work_items_in_scope
          work_items_with_commits
          work_items_with_null_cycle_time
          cadence
        ]
        specsOnly: $specsOnly
      }
      referenceString: $referenceString
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
        workItemsInScope
        workItemsWithCommits
        earliestClosedDate
        latestClosedDate
        targetPercentile
        cadence
      }
      arrivalDepartureTrends {
        measurementDate
        measurementWindow
        arrivals
        departures
        flowbacks
        passthroughs
    }
    }
  }
`;

export function useQueryDimensionFlowMetricsTrends({
  dimension,
  tags,
  release,
  instanceKey,
  before,
  days,
  measurementWindow,
  samplingFrequency,
  targetPercentile,
  leadTimeTargetPercentile,
  cycleTimeTargetPercentile,
  specsOnly,
  referenceString,
  defectsOnly,
  includeSubTasks
}) {
  return useQuery(getFlowMetricsTrendsQuery(dimension), {
    service: analytics_service,
    variables: {
      key: instanceKey,
      tags,
      release,
      days: days,
      before: before,
      measurementWindow: measurementWindow,
      samplingFrequency: samplingFrequency,

      leadTimeTargetPercentile: leadTimeTargetPercentile || targetPercentile,
      cycleTimeTargetPercentile: cycleTimeTargetPercentile || targetPercentile,
      referenceString: referenceString,
      specsOnly: specsOnly,
      defectsOnly: defectsOnly,
      includeSubTasks: includeSubTasks
    },
    errorPolicy: "all",
    pollInterval: analytics_service.defaultPollInterval(),
  });
}

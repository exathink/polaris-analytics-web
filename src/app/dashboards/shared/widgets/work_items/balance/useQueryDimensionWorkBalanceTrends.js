import { useQuery, gql } from "@apollo/client";
import {analytics_service} from "../../../../../services/graphql";

export function useQueryDimensionWorkBalanceTrends(
  {
    dimension,
    instanceKey,
    tags,
    before,
    days,
    measurementWindow,
    samplingFrequency,
    showContributorDetail,
    includeSubTasks,
    referenceString
  }) {
  return useQuery(
    gql`
     query ${dimension}CapacityTrends(
          $key: String!, 
          $tags: [String],
          $days: Int!,
          $measurementWindow: Int!,
          $samplingFrequency: Int!,
          $before: Date,
          $showContributorDetail: Boolean,
          $includeSubTasks: Boolean,
          $referenceString: String,
          ) {
      ${dimension}(
            key: $key,
            tags: $tags,
            interfaces: [CapacityTrends, CycleMetricsTrends],
             capacityTrendsArgs: {
              before: $before,
              days: $days,
              measurementWindow: $measurementWindow,
              samplingFrequency: $samplingFrequency,
              showContributorDetail: $showContributorDetail
            },
            cycleMetricsTrendsArgs: {
                before: $before,
                days: $days,
                measurementWindow: $measurementWindow,
                samplingFrequency: $samplingFrequency,
                includeSubTasks: $includeSubTasks
                metrics: [
                    total_effort
                ]
            }
            referenceString: $referenceString,
            ) {
            capacityTrends {   
                measurementDate
                contributorCount
                totalCommitDays
                avgCommitDays
                minCommitDays
                maxCommitDays
            }
            contributorDetail {
                measurementDate
                contributorKey
                contributorName
                totalCommitDays
            }
            cycleMetricsTrends {
                measurementDate
                totalEffort
            }
        }
     }
  `,
    {
      service: analytics_service,
      variables: {
        key: instanceKey,
        tags: tags,
        days: days,
        before: before,
        showContributorDetail: showContributorDetail,
        measurementWindow: measurementWindow,
        samplingFrequency: samplingFrequency,
        includeSubTasks: includeSubTasks,
        referenceString: referenceString,
      },
      errorPolicy: "all",
      pollInterval: analytics_service.defaultPollInterval()
    }
  )
}
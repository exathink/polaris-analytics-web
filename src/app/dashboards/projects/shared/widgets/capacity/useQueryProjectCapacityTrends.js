import {useQuery} from "@apollo/react-hooks";
import gql from "graphql-tag";
import {analytics_service} from "../../../../../services/graphql";

export function useQueryProjectCapacityTrends(
  {
    instanceKey,
    before,
    days,
    measurementWindow,
    samplingFrequency,
    showContributorDetail,
    referenceString
  }) {
  return useQuery(
    gql`
     query projectCapacityTrends(
          $key: String!, 
          $days: Int!,
          $measurementWindow: Int!,
          $samplingFrequency: Int!,
          $before: DateTime,
          $showContributorDetail: Boolean,
          $referenceString: String,
          ) {
      project(
            key: $key, 
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
        days: days,
        before: before,
        showContributorDetail: showContributorDetail,
        measurementWindow: measurementWindow,
        samplingFrequency: samplingFrequency,
        referenceString: referenceString,
      },
      errorPolicy: "all",
      pollInterval: analytics_service.defaultPollInterval()
    }
  )
}
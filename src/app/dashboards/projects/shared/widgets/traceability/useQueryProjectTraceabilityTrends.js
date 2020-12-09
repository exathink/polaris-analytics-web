import { useQuery, gql } from "@apollo/client";
import {analytics_service} from "../../../../../services/graphql";

export function useQueryProjectTraceabilityTrends(
  {
    instanceKey,
    before,
    days,
    measurementWindow,
    samplingFrequency,
    excludeMerges,
    referenceString
  }) {
  return useQuery(
    gql`
     query projectTraceabilityTrends(
          $key: String!, 
          $days: Int!,
          $measurementWindow: Int!,
          $samplingFrequency: Int!,
          $before: DateTime,
          $excludeMerges: Boolean,
          $referenceString: String, 
          ) {
      project(
            key: $key, 
            interfaces: [TraceabilityTrends],
             traceabilityTrendsArgs: {
              before: $before,
              days: $days,
              measurementWindow: $measurementWindow,
              samplingFrequency: $samplingFrequency,
              excludeMerges: $excludeMerges,
            },
            referenceString: $referenceString,
            ) {
            traceabilityTrends {   
                measurementDate
                traceability
                specCount
                nospecCount
                totalCommits
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
        excludeMerges: excludeMerges,
        referenceString: referenceString,
      },
      errorPolicy: "all",
      pollInterval: analytics_service.defaultPollInterval()
    }
  )
}
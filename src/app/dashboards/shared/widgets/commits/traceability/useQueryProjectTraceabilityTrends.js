import { useQuery, gql } from "@apollo/client";
import {analytics_service} from "../../../../../services/graphql";

export function useQueryProjectTraceabilityTrends(
  {
    instanceKey,
    release,
    tags,
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
          $tags: [String],
          $release: String,
          $days: Int!,
          $measurementWindow: Int!,
          $samplingFrequency: Int!,
          $before: Date,
          $excludeMerges: Boolean,
          $referenceString: String, 
          ) {
      project(
            key: $key,
            tags: $tags,
            release: $release,
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
        release: release,
        tags: tags,
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
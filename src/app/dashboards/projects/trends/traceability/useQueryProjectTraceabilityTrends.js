import {useQuery} from "@apollo/react-hooks";
import gql from "graphql-tag";
import {analytics_service} from "../../../../services/graphql";

export function useQueryProjectTraceabilityTrends(
  {
    instanceKey,
    before,
    days,
    measurementWindow,
    samplingFrequency,
    referenceString
  }) {
  return useQuery(
    gql`
     query projectFlowMetricsTrends(
          $key: String!, 
          $days: Int!,
          $measurementWindow: Int!,
          $samplingFrequency: Int!,
          $before: DateTime,
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
        referenceString: referenceString,
      },
      errorPolicy: "all",
      pollInterval: analytics_service.defaultPollInterval()
    }
  )
}
import {useQuery} from "@apollo/react-hooks";
import gql from "graphql-tag";
import {analytics_service} from "../../../../services/graphql";

export function useQueryProjectFlowMixTrends(
  {
    instanceKey,
    before,
    days,
    measurementWindow,
    samplingFrequency,
    specsOnly,
    referenceString
  }) {
  return useQuery(
    gql`
     query projectFlowMixTrends(
          $key: String!, 
          $days: Int!,
          $measurementWindow: Int!,
          $samplingFrequency: Int!,
          $before: DateTime,
          $referenceString: String, 
          $specsOnly: Boolean,
          ) {
      project(
            key: $key, 
            interfaces: [FlowMixTrends],
             flowMixTrendsArgs: {
              before: $before,
              days: $days,
              measurementWindow: $measurementWindow,
              samplingFrequency: $samplingFrequency,
              specsOnly: $specsOnly,
            },
            referenceString: $referenceString,
            ) {
            flowMixTrends {   
                measurementDate
                flowMix {
                    category
                    workItemCount
                    totalEffort
                }
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
        specsOnly: specsOnly,
        referenceString: referenceString,
      },
      errorPolicy: "all",
      pollInterval: analytics_service.defaultPollInterval()
    }
  )
}
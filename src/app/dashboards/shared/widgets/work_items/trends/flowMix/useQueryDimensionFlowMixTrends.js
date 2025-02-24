import { useQuery, gql } from "@apollo/client";
import {analytics_service} from "../../../../../../services/graphql";

export function useQueryDimensionFlowMixTrends(
  {
    dimension,
    tags,
    release,
    instanceKey,
    before,
    days,
    measurementWindow,
    samplingFrequency,
    specsOnly,
    includeSubTasks,
    referenceString
  }) {
  return useQuery(
    gql`
     query ${dimension}FlowMixTrends(
          $key: String!, 
          $tags: [String],
          $release: String
          $days: Int!,
          $measurementWindow: Int!,
          $samplingFrequency: Int!,
          $before: Date,
          $referenceString: String, 
          $specsOnly: Boolean,
          $includeSubTasks: Boolean
          ) {
      ${dimension}(
            key: $key, 
            tags: $tags,
            release: $release,
            interfaces: [FlowMixTrends],
             flowMixTrendsArgs: {
              before: $before,
              days: $days,
              measurementWindow: $measurementWindow,
              samplingFrequency: $samplingFrequency,
              specsOnly: $specsOnly,
              includeSubTasks: $includeSubTasks
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
        tags: tags,
        release: release,
        days: days,
        before: before,
        measurementWindow: measurementWindow,
        samplingFrequency: samplingFrequency,
        specsOnly: specsOnly,
        includeSubTasks: includeSubTasks,
        referenceString: referenceString
      },
      errorPolicy: "all",
      pollInterval: analytics_service.defaultPollInterval()
    }
  )
}
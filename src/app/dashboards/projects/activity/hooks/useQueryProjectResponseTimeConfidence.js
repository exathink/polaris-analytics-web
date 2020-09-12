import {useQuery} from "@apollo/react-hooks";
import gql from "graphql-tag";
import {analytics_service} from "../../../../services/graphql";


export function useQueryProjectResponseTimeConfidenceTrends(
  {instanceKey, days, measurementWindow, samplingFrequency, leadTimeTarget, cycleTimeTarget, specsOnly, referenceString}
  ) {
  return useQuery(
    gql`
        query projectResponseTimeTrends(
            $key: String!,
            $days: Int!,
            $measurementWindow: Int!,
            $samplingFrequency: Int!,
            $leadTimeTarget: Int!,
            $cycleTimeTarget: Int!,
            $specsOnly: Boolean,
            $referenceString: String

        ) {
            project(
                key: $key,
                interfaces: [ResponseTimeConfidenceTrends],
                responseTimeConfidenceTrendsArgs: {
                    days: $days,
                    measurementWindow: $measurementWindow,
                    samplingFrequency: $samplingFrequency,
                    leadTimeTarget : $leadTimeTarget,
                    cycleTimeTarget: $cycleTimeTarget,
                }
                specsOnly: $specsOnly,
                referenceString: $referenceString

            ) {

                responseTimeConfidenceTrends {
                    measurementDate
                    measurementWindow
                    leadTimeTarget
                    leadTimeConfidence
                    cycleTimeTarget
                    cycleTimeConfidence
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
        cycleTimeTarget: cycleTimeTarget,
        specsOnly: specsOnly,
        referenceString: referenceString
      },
      errorPolicy: "all",
      pollInterval: analytics_service.defaultPollInterval()
    }
  );
}
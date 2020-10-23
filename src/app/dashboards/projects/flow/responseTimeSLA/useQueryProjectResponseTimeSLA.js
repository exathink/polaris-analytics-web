import {useQuery} from "@apollo/react-hooks";
import gql from "graphql-tag";
import {analytics_service} from "../../../../services/graphql";


export function useQueryProjectResponseTimeSLA(
  {instanceKey, days, leadTimeTarget, leadTimeConfidenceTarget,
    cycleTimeTarget, cycleTimeConfidenceTarget, specsOnly, referenceString}
  ) {
  return useQuery(
    gql`
        query projectResponseTimeSLA(
            $key: String!,
            $days: Int!,
            $leadTimeTarget: Int!,
            $leadTimeConfidenceTarget: Float!,
            $cycleTimeTarget: Int!,
            $cycleTimeConfidenceTarget: Float!,
            $specsOnly: Boolean,
            $referenceString: String

        ) {
            project(
                key: $key,
                interfaces: [ResponseTimeConfidenceTrends, CycleMetricsTrends],
                responseTimeConfidenceTrendsArgs: {
                    days: 7,
                    measurementWindow: $days,
                    samplingFrequency: 7,
                    leadTimeTarget : $leadTimeTarget,
                    cycleTimeTarget: $cycleTimeTarget,
                    specsOnly: $specsOnly,
                },
                cycleMetricsTrendsArgs: {
                    days: 7,
                    measurementWindow: $days,
                    samplingFrequency: 7,
                    leadTimeTargetPercentile: $leadTimeConfidenceTarget,
                    cycleTimeTargetPercentile: $cycleTimeConfidenceTarget,
                    specsOnly: $specsOnly,
                    metrics: [
                        percentile_lead_time,
                        percentile_cycle_time
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
                    percentileLeadTime
                    percentileCycleTime
                }
            }
        }
    `, {

      service: analytics_service,
      variables: {
        key: instanceKey,
        days: days,
        leadTimeTarget: leadTimeTarget,
        leadTimeConfidenceTarget: leadTimeConfidenceTarget,
        cycleTimeTarget: cycleTimeTarget,
        cycleTimeConfidenceTarget: cycleTimeConfidenceTarget,
        specsOnly: specsOnly,
        referenceString: referenceString
      },
      errorPolicy: "all",
      pollInterval: analytics_service.defaultPollInterval()
    }
  );
}
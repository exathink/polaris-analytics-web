import {useQuery, gql} from "@apollo/client";
import {analytics_service} from "../../../../services/graphql";

export const FLOW_RATE_TRENDS_QUERY = gql`
  query projectFlowRateTrends(
    $key: String!
    $days: Int!
    $measurementWindow: Int!
    $samplingFrequency: Int!
    $referenceString: String
    $defectsOnly: Boolean
    $specsOnly: Boolean
  ) {
    project(
      key: $key
      interfaces: [FlowRateTrends]
      flowRateTrendsArgs: {
        days: $days
        measurementWindow: $measurementWindow
        samplingFrequency: $samplingFrequency
        metrics: [arrival_rate, close_rate]
        defectsOnly: $defectsOnly
        specsOnly: $specsOnly
      }
      referenceString: $referenceString
    ) {
      flowRateTrends {
        measurementDate
        measurementWindow
        arrivalRate
        closeRate
      }
    }
  }
`;

export function useQueryProjectFlowRateTrends({
  instanceKey,
  days,
  measurementWindow,
  samplingFrequency,
  referenceString,
  defectsOnly,
  specsOnly,
}) {
  return useQuery(FLOW_RATE_TRENDS_QUERY, {
    service: analytics_service,
    variables: {
      key: instanceKey,
      days: days,
      measurementWindow: measurementWindow,
      samplingFrequency: samplingFrequency,
      referenceString: referenceString,
      defectsOnly: defectsOnly,
      specsOnly: specsOnly,
    },
    errorPolicy: "all",
    pollInterval: analytics_service.defaultPollInterval(),
  });
}

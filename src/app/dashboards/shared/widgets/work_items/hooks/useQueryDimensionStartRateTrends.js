import {useQuery, gql} from "@apollo/client";
import {analytics_service} from "../../../../../services/graphql";

export const getStartRateTrendsQuery = (dimension) => gql`
  query ${dimension}FlowMetricsTrends(
    $key: String!
    $tags: [String]
    $release: String
    $days: Int!
    $measurementWindow: Int!
    $samplingFrequency: Int!
    $specsOnly: Boolean
    $referenceString: String
  ) {
    ${dimension}(
      key: $key
      tags: $tags
      release: $release,
      interfaces: [ArrivalDepartureTrends]
      arrivalDepartureTrendsArgs: {
        days: $days,
        measurementWindow: $measurementWindow,
        samplingFrequency: $samplingFrequency,
        specsOnly: $specsOnly,
        tags: $tags,
        release: $release,
        metric: wip_arrivals_departures,
      }
      referenceString: $referenceString
    ) {
      arrivalDepartureTrends {
        measurementDate
        measurementWindow
        arrivals
        departures
        flowbacks
        passthroughs
    }
    }
  }
`;

export function useQueryDimensionStartRateTrends({
  dimension,
  tags,
  release,
  instanceKey,
  days,
  measurementWindow,
  samplingFrequency,
  specsOnly,
  referenceString,
}) {
  return useQuery(getStartRateTrendsQuery(dimension), {
    service: analytics_service,
    variables: {
      key: instanceKey,
      tags,
      release,
      days: days,
      measurementWindow: measurementWindow,
      samplingFrequency: samplingFrequency,
      referenceString: referenceString,
      specsOnly: specsOnly,
    },
    errorPolicy: "all",
    pollInterval: analytics_service.defaultPollInterval(),
  });
}

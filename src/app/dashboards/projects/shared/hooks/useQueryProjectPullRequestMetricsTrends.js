import { useQuery, gql } from "@apollo/client";
import {analytics_service} from "../../../../services/graphql";

export function useQueryProjectPullRequestMetricsTrends({
  instanceKey,
  days,
  measurementWindow,
  samplingFrequency,
  referenceString,
}) {
  return useQuery(
    gql`
      query projectPullRequestMetricsTrends(
        $key: String!
        $days: Int!
        $measurementWindow: Int!
        $samplingFrequency: Int!
        $referenceString: String
      ) {
        project(
          key: $key
          interfaces: [PullRequestMetricsTrends]
          pullRequestMetricsTrendsArgs: {
            days: $days
            measurementWindow: $measurementWindow
            samplingFrequency: $samplingFrequency
            metrics: [avg_age, max_age, total_closed]
          }
          referenceString: $referenceString
        ) {
          pullRequestMetricsTrends {
            measurementDate
            measurementWindow
            avgAge
            maxAge
            totalClosed
          }
        }
      }
    `,
    {
      service: analytics_service,
      variables: {
        key: instanceKey,
        days: days,
        measurementWindow: measurementWindow,
        samplingFrequency: samplingFrequency,
        referenceString: referenceString,
      },
      errorPolicy: "all",
      pollInterval: analytics_service.defaultPollInterval(),
    }
  );
}

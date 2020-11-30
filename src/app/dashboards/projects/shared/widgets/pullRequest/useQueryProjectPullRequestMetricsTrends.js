import {useQuery} from "@apollo/react-hooks";
import gql from "graphql-tag";
import {analytics_service} from "../../../../../services/graphql";

export function useQueryProjectPullRequestMetricsTrends({instanceKey, days, measurementWindow, samplingFrequency}) {
  return useQuery(
    gql`
      query projectPullRequestMetricsTrends(
        $key: String!
        $days: Int!
        $measurementWindow: Int!
        $samplingFrequency: Int!
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
      },
      errorPolicy: "all",
      pollInterval: analytics_service.defaultPollInterval(),
    }
  );
}

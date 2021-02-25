import {useQuery, gql} from "@apollo/client";
import {analytics_service} from "../../../../services/graphql";

export function useQueryProjectBacklogTrends({
  instanceKey,
  days,
  measurementWindow,
  samplingFrequency,
  defectsOnly,
  specsOnly,
}) {
  return useQuery(
    gql`
      query projectBacklogTrends(
        $key: String!
        $days: Int!
        $measurementWindow: Int!
        $samplingFrequency: Int!
        $defectsOnly: Boolean
        $specsOnly: Boolean
      ) {
        project(
          key: $key
          interfaces: [BacklogTrends]
          backlogTrendsArgs: {
            days: $days
            measurementWindow: $measurementWindow
            samplingFrequency: $samplingFrequency
            metrics: [
              backlog_size
              min_backlog_size
              max_backlog_size
              q1_backlog_size
              q3_backlog_size
              median_backlog_size
              avg_backlog_size
            ]
            defectsOnly: $defectsOnly
            specsOnly: $specsOnly
          }
        ) {
          backlogTrends {
            measurementDate
            measurementWindow
            backlogSize
            minBacklogSize
            maxBacklogSize
            q1BacklogSize
            q3BacklogSize
            medianBacklogSize
            avgBacklogSize
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
        defectsOnly: defectsOnly,
        specsOnly: specsOnly,
      },
      errorPolicy: "all",
      pollInterval: analytics_service.defaultPollInterval(),
    }
  );
}

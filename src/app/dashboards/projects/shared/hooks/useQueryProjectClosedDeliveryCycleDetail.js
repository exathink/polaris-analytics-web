import {useQuery, gql} from "@apollo/client";
import {analytics_service} from "../../../../services/graphql";

export const PROJECT_CLOSED_DELIVERY_CYCLE_DETAIL = gql`
  query projectClosedDeliveryCycleDetail(
    $key: String!
    $referenceString: String
    $days: Int
    $before: Date
    $defectsOnly: Boolean
    $specsOnly: Boolean
    $includeSubTasks: Boolean
  ) {
    project(key: $key, referenceString: $referenceString) {
      workItemDeliveryCycles(
        closedWithinDays: $days
        defectsOnly: $defectsOnly
        specsOnly: $specsOnly
        includeSubTasks: $includeSubTasks
        before: $before
        interfaces: [WorkItemInfo, DeliveryCycleInfo, CycleMetrics, ImplementationCost]
      ) {
        edges {
          node {
            name
            key

            displayId
            workItemKey
            workItemType
            isBug

            state

            startDate
            endDate

            leadTime
            cycleTime
            latency

            effort
            duration
            authorCount
          }
        }
      }
    }
  }
`;

export function useQueryProjectClosedDeliveryCycleDetail({instanceKey, days, defectsOnly, specsOnly, referenceString, before, includeSubTasks}) {
  return useQuery(PROJECT_CLOSED_DELIVERY_CYCLE_DETAIL, {
    service: analytics_service,
    variables: {
      key: instanceKey,
      days: days,
      defectsOnly: defectsOnly,
      specsOnly: specsOnly,
      before: before,
      includeSubTasks: includeSubTasks,
      referenceString: referenceString,
    },
    errorPolicy: "all",
    pollInterval: analytics_service.defaultPollInterval(),
  });
}

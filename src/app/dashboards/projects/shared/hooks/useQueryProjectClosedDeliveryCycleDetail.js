import {useQuery, gql} from "@apollo/client";
import {analytics_service} from "../../../../services/graphql";

export const queryDimensionClosedDeliveryCycleDetail = (dimension) =>  gql`
  query ${dimension}ClosedDeliveryCycleDetail(
    $key: String!
    $tags: [String]
    $referenceString: String
    $days: Int
    $before: Date
    $defectsOnly: Boolean
    $specsOnly: Boolean
    $includeSubTasks: Boolean
    $first: Int
    $after: String
  ) {
    ${dimension}(key: $key, referenceString: $referenceString) {
      workItemDeliveryCycles(
        tags: $tags
        closedBefore: $before
        closedWithinDays: $days
        defectsOnly: $defectsOnly
        specsOnly: $specsOnly
        includeSubTasks: $includeSubTasks
        first: $first
        after: $after
        interfaces: [WorkItemInfo, DeliveryCycleInfo, CycleMetrics, ImplementationCost, TeamNodeRefs, EpicNodeRef, WorkItemsSourceRef]
      ) {
        pageInfo {
          hasNextPage
          hasPreviousPage
          startCursor
          endCursor
        }
        count
        edges {
          node {
            name
            key

            displayId
            workItemKey
            workItemType
            isBug

            state
            stateType

            startDate
            endDate

            teamNodeRefs {
              teamName
              teamKey
            }
            
            epicName

            leadTime
            cycleTime
            latency

            effort
            duration
            authorCount
            
            workItemsSourceName
            workItemsSourceKey
            workTrackingIntegrationType
          }
        }
      }
    }
  }
`;

export function useQueryProjectClosedDeliveryCycleDetail({dimension, instanceKey, tags, days, defectsOnly, specsOnly, referenceString, before, includeSubTasks, first, after}) {
  return useQuery(queryDimensionClosedDeliveryCycleDetail(dimension), {
    service: analytics_service,
    variables: {
      key: instanceKey,
      tags: tags,
      days: days,
      defectsOnly: defectsOnly,
      specsOnly: specsOnly,
      before: before,
      includeSubTasks: includeSubTasks,
      referenceString: referenceString,
      first: first,
      after: after
    },
    errorPolicy: "all",
    pollInterval: analytics_service.defaultPollInterval(),
  });
}

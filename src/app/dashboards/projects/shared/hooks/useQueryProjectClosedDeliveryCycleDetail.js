import {useQuery, gql} from "@apollo/client";
import {analytics_service} from "../../../../services/graphql";

export const queryDimensionClosedDeliveryCycleDetail = (dimension) =>  gql`
  query ${dimension}ClosedDeliveryCycleDetail(
    $key: String!
    $referenceString: String
    $days: Int
    $before: Date
    $defectsOnly: Boolean
    $specsOnly: Boolean
    $includeSubTasks: Boolean
  ) {
    ${dimension}(key: $key, referenceString: $referenceString) {
      workItemDeliveryCycles(
        closedBefore: $before
        closedWithinDays: $days
        defectsOnly: $defectsOnly
        specsOnly: $specsOnly
        includeSubTasks: $includeSubTasks
        
        interfaces: [WorkItemInfo, DeliveryCycleInfo, CycleMetrics, ImplementationCost, TeamNodeRefs, EpicNodeRef, WorkItemsSourceRef]
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

export function useQueryProjectClosedDeliveryCycleDetail({dimension, instanceKey, days, defectsOnly, specsOnly, referenceString, before, includeSubTasks}) {
  return useQuery(queryDimensionClosedDeliveryCycleDetail(dimension), {
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

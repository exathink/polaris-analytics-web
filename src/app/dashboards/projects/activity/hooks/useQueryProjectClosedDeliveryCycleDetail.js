import {useQuery} from "@apollo/react-hooks";
import gql from "graphql-tag";
import {analytics_service} from "../../../../services/graphql";

export function useQueryProjectClosedDeliveryCycleDetail({instanceKey, days, referenceString}) {
  return useQuery(
    gql`
     query projectClosedDeliveryCycleDetail($key: String!, $referenceString: String, $days: Int) {
      project(
            key: $key, 
            referenceString: $referenceString,
            ) {
          id
          workItemDeliveryCycles(
            closedWithinDays: $days,
            interfaces: [WorkItemInfo, DeliveryCycleInfo, CycleMetrics]
          ) {
               edges {
                  node {
                      id
                      name
                      key
                      ... on WorkItemInfo {
                        displayId
                        workItemType
                      }
                      ... on DeliveryCycleInfo {
                        startDate
                        endDate
                        
                      }
                      ... on CycleMetrics {
                        leadTime
                        cycleTime
                      }
                  }
               }
          }
      }
     }
`,
    {
      service: analytics_service,
      variables: {
        key: instanceKey,
        days: days,
        referenceString: referenceString
      },
      errorPolicy: "all",
      pollInterval: analytics_service.defaultPollInterval()
    }
  )
}
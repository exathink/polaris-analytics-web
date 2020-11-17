import {useQuery} from "@apollo/react-hooks";
import gql from "graphql-tag";
import {analytics_service} from "../../../../services/graphql";


export function useQueryProjectStateTypes({instanceKey, closedWithinDays}) {
  return useQuery(
    gql`
     query projectStateTypes($key: String!, $closedWithinDays: Int) {
      project(
        key: $key, interfaces: [WorkItemStateTypeAggregateMetrics],
          closedWithinDays: $closedWithinDays
        ) {
          workItemStateTypeCounts {
            backlog
            open
            wip
            complete
            closed
            unmapped
          }
        }    
     }
`, {

      service: analytics_service,
      variables: {
        key: instanceKey,
        closedWithinDays: closedWithinDays || 30
      },
      errorPolicy: "all",
      pollInterval: analytics_service.defaultPollInterval()
    }
  )
}
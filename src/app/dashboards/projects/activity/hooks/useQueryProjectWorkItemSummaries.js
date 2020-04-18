import {useQuery} from "@apollo/react-hooks";
import gql from "graphql-tag";
import {analytics_service} from "../../../../services/graphql";


export function useQueryProjectWorkItemSummaries({instanceKey, referenceString}) {
  return useQuery(
    gql`
     query projectWorkItemSummaries($key: String!, $referenceString: String) {
      project(key: $key, interfaces: [WorkItemStateTypeCounts], referenceString: $referenceString) {
          id
          ... on WorkItemStateTypeCounts {
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
     }
`, {

      service: analytics_service,
      variables: {
        key: instanceKey,
        referenceString: referenceString

      },
      errorPolicy: "all",
      pollInterval: analytics_service.defaultPollInterval()
    }
  )
}
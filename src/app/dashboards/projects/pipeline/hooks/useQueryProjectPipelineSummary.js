import {useQuery} from "@apollo/react-hooks";
import gql from "graphql-tag";
import {analytics_service} from "../../../../services/graphql";


export function useQueryProjectPipelineSummary({instanceKey, referenceString, defectsOnly,  closedWithinDays}) {
  return useQuery(
    gql`
     query projectPipelineSummary($key: String!, $defectsOnly: Boolean, $closedWithinDays: Int, $referenceString: String) {
      project(
        key: $key, interfaces: [WorkItemStateTypeAggregateMetrics],
        defectsOnly: $defectsOnly, 
        closedWithinDays: $closedWithinDays, 
        referenceString: $referenceString) {
        
          workItemStateTypeCounts {
            backlog
            open
            wip
            complete
            closed
            unmapped
          }
          specStateTypeCounts {
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
        referenceString: referenceString,
        defectsOnly: defectsOnly,
        closedWithinDays: closedWithinDays
      },
      errorPolicy: "all",
      pollInterval: analytics_service.defaultPollInterval()
    }
  )
}
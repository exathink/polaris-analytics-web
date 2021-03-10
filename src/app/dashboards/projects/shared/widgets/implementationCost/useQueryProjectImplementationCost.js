import { useQuery, gql } from "@apollo/client";
import {analytics_service} from "../../../../../services/graphql";

export function useQueryProjectImplementationCost({instanceKey, activeOnly, specsOnly, days, referenceString}) {
  return useQuery(
    gql`
        query getProjectImplementationCost(
            $projectKey: String!, 
            $activeOnly: Boolean,
            $specsOnly: Boolean,
            $days: Int,
            $referenceString: String) {
            project(key: $projectKey, referenceString: $referenceString) {
                id
                workItemDeliveryCycles(
                    interfaces: [ImplementationCost, EpicNodeRef],
                    activeOnly: $activeOnly, 
                    specsOnly: $specsOnly,
                    closedWithinDays: $days
                ) {
                    edges {
                        node {
                            name
                            key
                            workItemKey
                            displayId
                            epicName
                            epicKey
                            effort
                        }
                    }
                }
            }
        }`,
    {
      service: analytics_service,
      variables: {
        projectKey: instanceKey,
        activeOnly: activeOnly,
        specsOnly : specsOnly,
        days: days,
        referenceString: referenceString
      },
      errorPolicy: "all"
    }
  )
}

import {useQuery} from "@apollo/react-hooks";
import gql from "graphql-tag";
import {analytics_service} from "../../../../services/graphql";

export function useQueryProjectImplementationCost({instanceKey, activeOnly, specOnly, days, referenceString}) {
  return useQuery(
    gql`
        query getProjectImplementationCost(
            $projectKey: String!, 
            $activeOnly: Boolean,
            $specsOnly: Boolean,
            $days: Int,
            $referenceString: String) {
            project(key: $projectKey, referenceString: $referenceString) {
                workItems(
                    interfaces: [ImplementationCost, EpicNodeRef],
                    activeOnly: $activeOnly, 
                    specsOnly: $specsOnly,
                    closedWithinDays: $days
                ) {
                    edges {
                        node {
                            id
                            name
                            key
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
        specsOnly : specOnly,
        days: days,
        referenceString: referenceString
      },
      errorPolicy: "all"
    }
  )
}

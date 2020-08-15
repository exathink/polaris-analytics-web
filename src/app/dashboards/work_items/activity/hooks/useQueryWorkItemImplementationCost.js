import {useQuery} from "@apollo/react-hooks";
import gql from "graphql-tag";
import {analytics_service} from "../../../../services/graphql";

export function useQueryWorkItemImplementationCost({instanceKey, referenceString}) {
  return useQuery(
    gql`
      query workItemImplementationCost($key: String!, $referenceString: String) {
        workItem(key: $key, interfaces: [ImplementationCost], referenceString: $referenceString){
              id
              name
              key
              
              effort
              duration
              authorCount
              
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
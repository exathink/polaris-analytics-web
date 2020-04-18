import {useQuery} from "@apollo/react-hooks";
import gql from "graphql-tag";
import {analytics_service} from "../../../../services/graphql";

export function useQueryProjectWorkItemsSourceStateMappings({instanceKey}){
  return useQuery(
    gql`
            query getProjectWorkItemSourceStateMappings($projectKey: String!) {
              project(key: $projectKey) {
                id
                workItemsSources(interfaces: [WorkItemStateMappings]) {
                  edges {
                    node {
                      id
                      workItemStateMappings {
                        state
                        stateType
                      }
                    }
                  }
                }
              }
            }`,
    {
      service: analytics_service,
      variables: {
        projectKey: instanceKey
      },
      errorPolicy: "all"
    }
  )
}

export function useProjectWorkItemSourcesStateMappings(instanceKey) {
  const {loading, error, data} = useQueryProjectWorkItemsSourceStateMappings({instanceKey});
  if (loading || error) return null;

  return data.project.workItemsSources.edges.map(
    edge => edge.node.workItemStateMappings
  )

}
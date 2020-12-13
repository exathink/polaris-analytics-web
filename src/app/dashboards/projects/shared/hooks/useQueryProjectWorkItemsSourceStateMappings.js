import { useMutation, useQuery, gql } from "@apollo/client";
import {analytics_service} from "../../../../services/graphql";

export const GET_STATE_MAPPING_QUERY = gql`
  query getProjectWorkItemSourceStateMappings($projectKey: String!) {
    project(key: $projectKey) {
      workItemsSources(interfaces: [WorkItemStateMappings]) {
        edges {
          node {
            key
            name
            workItemStateMappings {
              state
              stateType
            }
          }
        }
      }
    }
  }
`;

export function useQueryProjectWorkItemsSourceStateMappings({instanceKey}) {
  return useQuery(GET_STATE_MAPPING_QUERY, {
    service: analytics_service,
    variables: {
      projectKey: instanceKey,
    },
    errorPolicy: "all",
  });
}

export function useProjectWorkItemSourcesStateMappings(instanceKey) {
  const {loading, error, data} = useQueryProjectWorkItemsSourceStateMappings({instanceKey});
  if (loading || error) return null;

  return data.project.workItemsSources.edges.map((edge) => edge.node.workItemStateMappings);
}

export function updateProjectWorkItemSourceStateMaps({onCompleted}) {
  return useMutation(
    gql`
      mutation updateWorkItemSourceStateMappings(
        $projectKey: String!
        $workItemsSourceStateMaps: [WorkItemsSourceStateMap]
      ) {
        updateProjectStateMaps(
          updateProjectStateMapsInput: {projectKey: $projectKey, workItemsSourceStateMaps: $workItemsSourceStateMaps}
        ) {
          success
          errorMessage
        }
      }
    `,
    {onCompleted}
  );
}

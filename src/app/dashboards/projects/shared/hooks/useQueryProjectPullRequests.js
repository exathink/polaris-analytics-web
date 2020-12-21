import {useQuery, gql} from "@apollo/client";
import {analytics_service} from "../../../../services/graphql";

export const GET_PROJECT_PULL_REQUESTS = gql`
  query getProjectPullRequests($projectKey: String!, $activeOnly: Boolean, $referenceString: String) {
    project(key: $projectKey, referenceString: $referenceString) {
      id
      pullRequests(interfaces: [BranchRef, WorkItemsSummaries], activeOnly: $activeOnly) {
        edges {
          node {
            id
            name
            key
            displayId
            state
            repositoryKey
            repositoryName
            age
            webUrl
            workItemsSummaries {
              displayId
              key
              state
              stateType
            }
          }
        }
      }
    }
  }
`;

export function useQueryProjectPullRequests({instanceKey, activeOnly, referenceString}) {
  return useQuery(GET_PROJECT_PULL_REQUESTS, {
    service: analytics_service,
    variables: {
      projectKey: instanceKey,
      activeOnly: activeOnly,
      referenceString: referenceString,
    },
    errorPolicy: "all",
  });
}

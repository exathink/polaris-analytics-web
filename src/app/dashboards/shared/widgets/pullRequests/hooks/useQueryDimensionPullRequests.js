import {useQuery, gql} from "@apollo/client";
import {analytics_service} from "../../../../../services/graphql";

export const getProjectPullRequests = (dimension) => gql`
query ${dimension}PullRequests(
  $projectKey: String!
  $activeOnly: Boolean
  $referenceString: String
) {
  ${dimension}(key: $projectKey, referenceString: $referenceString) {
    id
    pullRequests(
      interfaces: [BranchRef, WorkItemsSummaries]
      activeOnly: $activeOnly
    ) {
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

export function useQueryDimensionPullRequests({dimension, instanceKey, activeOnly, referenceString}) {
  return useQuery(getProjectPullRequests(dimension), {
    service: analytics_service,
    variables: {
      projectKey: instanceKey,
      activeOnly: activeOnly,
      referenceString: referenceString,
    },
    errorPolicy: "all",
  });
}

import {useQuery, gql} from "@apollo/client";
import {analytics_service} from "../../../../../services/graphql";

export const getProjectPullRequests = (dimension) => gql`
query ${dimension}PullRequests(
  $projectKey: String!
  $activeOnly: Boolean
  $before: DateTime
  $closedWithinDays: Int
  $referenceString: String
) {
  ${dimension}(key: $projectKey, referenceString: $referenceString) {
    id
    pullRequests(
      interfaces: [BranchRef, WorkItemsSummaries]
      activeOnly: $activeOnly
      before: $before
      closedWithinDays: $closedWithinDays
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
          endDate
          createdAt
          workItemsSummaries {
            displayId
            name
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

export function useQueryDimensionPullRequests({dimension, instanceKey, activeOnly, before, closedWithinDays, referenceString}) {
  return useQuery(getProjectPullRequests(dimension), {
    service: analytics_service,
    variables: {
      projectKey: instanceKey,
      activeOnly: activeOnly,
      before: before,
      closedWithinDays: closedWithinDays,
      referenceString: referenceString,
    },
    errorPolicy: "all",
  });
}

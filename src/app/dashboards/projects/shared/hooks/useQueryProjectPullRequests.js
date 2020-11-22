import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { analytics_service } from "../../../../services/graphql";

export function useQueryProjectPullRequests({
  instanceKey,
  activeOnly,
  referenceString,
}) {
  return useQuery(
    gql`
      query getProjectPullRequests(
        $projectKey: String!
        $activeOnly: Boolean
        $referenceString: String
      ) {
        project(key: $projectKey, referenceString: $referenceString) {
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
    `,
    {
      service: analytics_service,
      variables: {
        projectKey: instanceKey,
        activeOnly: activeOnly,
        referenceString: referenceString,
      },
      errorPolicy: "all",
    }
  );
}

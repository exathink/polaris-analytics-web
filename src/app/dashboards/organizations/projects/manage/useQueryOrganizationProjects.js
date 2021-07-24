import {useQuery, gql} from "@apollo/client";
import {analytics_service} from "../../../../services/graphql";

export const GET_PROJECTS_QUERY = gql`
  query organizationProjects($organizationKey: String!) {
    organization(key: $organizationKey) {
      id
      projects(interfaces: [CommitSummary, RepositoryCount, WorkItemEventSpan]) {
        count
        edges {
          node {
            id
            name
            key
            repositoryCount
            latestCommit
            latestWorkItemEvent
            workItemsSources {
              count
            }
          }
        }
      }
    }
  }
`;

export function useQueryOrganizationProjects({organizationKey}) {
  return useQuery(GET_PROJECTS_QUERY, {
    service: analytics_service,
    variables: {
      organizationKey: organizationKey,
    },
    errorPolicy: "all",
    fetchPolicy: "cache-and-network",
  });
}

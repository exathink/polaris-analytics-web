import {useQuery, gql} from "@apollo/client";
import {analytics_service} from "../../../../services/graphql";

export const GET_ORGANIZATION_TEAMS_QUERY = gql`
  query getOrganizationTeamsInfo($organizationKey: String!) {
    organization(key: $organizationKey) {
      teams {
        edges {
          node {
            name
            key
            contributorCount
          }
        }
      }
    }
  }
`;

export function useQueryOrganizationTeams({organizationKey}) {
  return useQuery(GET_ORGANIZATION_TEAMS_QUERY, {
    service: analytics_service,
    variables: {
      organizationKey: organizationKey,
    },
    errorPolicy: "all",
  });
}

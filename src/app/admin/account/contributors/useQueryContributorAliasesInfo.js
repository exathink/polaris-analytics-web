import {useQuery, gql} from "@apollo/client";
import {analytics_service} from "../../../services/graphql";

export const GET_CONTRIBUTOR_ALIASES_INFO_QUERY = gql`
  query getContributorAliasesInfo($accountKey: String!, $commitWithinDays: Int) {
    account(key: $accountKey) {
      contributors(interfaces: [CommitSummary, ContributorAliasesInfo], commitWithinDays: $commitWithinDays) {
        edges {
          node {
            id
            key
            name
            earliestCommit
            latestCommit
            commitCount
            contributorAliasesInfo {
              key
              name
              alias
              latestCommit
              earliestCommit
              commitCount
            }
          }
        }
      }
    }
  }
`;

export function useQueryContributorAliasesInfo({accountKey, commitWithinDays}) {
  return useQuery(GET_CONTRIBUTOR_ALIASES_INFO_QUERY, {
    service: analytics_service,
    variables: {
      accountKey: accountKey,
      commitWithinDays: commitWithinDays
    },
    errorPolicy: "all",
  });
}


// Organization

export const GET_ORGANIZATION_TEAMS_INFO_QUERY = gql`
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

export function useQueryOrganizationTeamsInfo({organizationKey}) {
  return useQuery(GET_ORGANIZATION_TEAMS_INFO_QUERY, {
    service: analytics_service,
    variables: {
      organizationKey: organizationKey,
    },
    errorPolicy: "all",
  });
}
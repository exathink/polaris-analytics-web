import {useQuery, gql} from "@apollo/client";
import {analytics_service} from "../../../services/graphql";

export const ACCOUNT_USERS_QUERY = gql`
  query accountUsers($accountKey: String!, $pageSize: Int!, $endCursor: String) {
    account(key: $accountKey) {
      id
      key
      users(
        first: $pageSize, after: $endCursor, 
        interfaces: [UserInfo, ScopedRole, UserRoles], 
        userRolesArgs: {
          accountKey: $accountKey
        }) {
        count
        edges {
          node {
            id
            name
            firstName
            lastName
            key
            email
            role
            organizationRoles {
              name
              scopeKey
              role
            }
          }
        }
      }
    }
  }
`;

export function useQueryAccountUsers({pageSize, currentCursor, accountKey, newData}) {
  return useQuery(ACCOUNT_USERS_QUERY, {
    service: analytics_service,
    variables: {
      pageSize: pageSize,
      endCursor: currentCursor,
      accountKey: accountKey,
    },
    fetchPolicy: newData ? "network-only" : "cache-first",
    errorPolicy: "all",
  });
}

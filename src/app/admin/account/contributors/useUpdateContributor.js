import {useMutation, gql} from "@apollo/client";

export const UPDATE_CONTRIBUTOR_FOR_CONTRIBUTOR_ALIASES = gql`
  mutation updateContributor($contributorKey: String!, $updatedInfo: ContributorUpdatedInfo!) {
    updateContributorForContributorAliases(
      contributorAliasMapping: {contributorKey: $contributorKey, updatedInfo: $updatedInfo}
    ) {
      updateStatus {
        success
        contributorKey
        message
        exception
      }
    }
  }
`;
export function useUpdateContributorForContributorAliases({onCompleted, onError}) {
  return useMutation(UPDATE_CONTRIBUTOR_FOR_CONTRIBUTOR_ALIASES, {onCompleted, onError});
}

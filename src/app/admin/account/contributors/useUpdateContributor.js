import {useMutation, gql} from "@apollo/client";

export const UPDATE_CONTRIBUTOR = gql`
  mutation updateContributor($contributorKey: String!, $updatedInfo: ContributorUpdatedInfo!) {
    updateContributor(
      contributorInfo: {contributorKey: $contributorKey, updatedInfo: $updatedInfo}
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
export function useUpdateContributor({onCompleted, onError}) {
  return useMutation(UPDATE_CONTRIBUTOR, {onCompleted, onError});
}

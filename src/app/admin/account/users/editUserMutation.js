import {useMutation, gql} from "@apollo/client";

export const UPDATE_USER = gql`
  mutation update_contributor($userId: String!, $updatedInfo: UpdateUserInfo!) {
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
export function useUpdateUser({onCompleted, onError}) {
  return useMutation(UPDATE_USER, {onCompleted, onError});
}
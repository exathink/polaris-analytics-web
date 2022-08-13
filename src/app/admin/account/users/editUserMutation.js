import {useMutation, gql} from "@apollo/client";

export const UPDATE_USER = gql`
  mutation update_user($updateUserInput: UpdateUserInput!) {
    updateUser(updateUserInput: $updateUserInput) {
      user {
        id
        name
        key
      }
      updated
    }
  }
`;
export function useUpdateUser({onCompleted, onError}) {
  return useMutation(UPDATE_USER, {onCompleted, onError});
}

import {useMutation, gql} from "@apollo/client";

export const UPDATE_USER = gql`
  mutation update_user() {
    updateUser(updateUserInput: UpdateUserInput!) {
      user,
      updated
    }
  }
`;
export function useUpdateUser({onCompleted, onError}) {
  return useMutation(UPDATE_USER, {onCompleted, onError});
}
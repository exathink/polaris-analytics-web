import {useMutation, gql} from "@apollo/client";

export const EDIT_VALUE_STREAM = gql`
  mutation edit_value_stream($projectKey: String!, $valueStreamKey: String!, $name: String!, $description: String!, $workItemSelectors: [String]!) {
    editValueStream(
      editValueStreamInput: {
        projectKey: $projectKey
        valueStreamKey: $valueStreamKey
        name: $name
        description: $description
        workItemSelectors: $workItemSelectors
      }
    ) {
      success
      errorMessage
      valueStream {
          key
          name
          description
          workItemSelectors
      }
    }
  }
`;
export function useEditValueStream({onCompleted, onError}) {
  return useMutation(EDIT_VALUE_STREAM, {onCompleted, onError});
}
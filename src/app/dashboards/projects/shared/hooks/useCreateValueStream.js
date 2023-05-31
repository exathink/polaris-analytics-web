import {useMutation, gql} from "@apollo/client";

export const CREATE_VALUE_STREAM = gql`
  mutation create_value_stream($projectKey: String!, $name: String!, $description: String!, $workItemSelectors: [String]!) {
    createValueStream(
      createValueStreamInput: {
        projectKey: $projectKey
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
          workItemSelectors
      }
    }
  }
`;
export function useCreateValueStream({onCompleted, onError}) {
  return useMutation(CREATE_VALUE_STREAM, {onCompleted, onError});
}
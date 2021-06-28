import {useMutation, gql} from "@apollo/client";

export const CREATE_TEAM = gql`
  mutation create_team($organizationKey: String!, $name: String!) {
    createTeam(createTeamInput: {organizationKey: $organizationKey, name: $name}) {
      success
      errorMessage
    }
  }
`;
export function useCreateTeam({onCompleted, onError}) {
  return useMutation(CREATE_TEAM, {onCompleted, onError});
}

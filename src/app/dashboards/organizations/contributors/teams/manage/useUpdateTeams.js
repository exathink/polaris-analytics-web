import {useMutation, gql} from "@apollo/client";

export const UPDATE_TEAMS = gql`
  mutation update_teams($organizationKey: String!, $contributorTeamAssignments: [ContributorTeamAssignment]) {
    updateContributorTeamAssignments(
      updateContributorTeamAssignmentsInput: {
        organizationKey: $organizationKey
        contributorTeamAssignments: $contributorTeamAssignments
      }
    ) {
      updateStatus {
        success
        errorMessage
        updateCount
      }
    }
  }
`;
export function useUpdateTeams({onCompleted, onError}) {
  return useMutation(UPDATE_TEAMS, {onCompleted, onError});
}

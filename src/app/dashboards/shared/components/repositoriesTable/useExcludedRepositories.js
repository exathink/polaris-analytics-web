import {useMutation, gql} from "@apollo/client";

// we might need to update this query to be generic, currently its project specific
export const EXCLUDE_REPOSITORIES = gql`
  mutation exclude_repos($instanceKey: String!, $exclusions: [RepositoryExclusionState]!) {
    updateProjectExcludedRepositories(
      updateProjectExcludedRepositoriesInput: {projectKey: $instanceKey, exclusions: $exclusions}
    ) {
      success
      errorMessage
    }
  }
`;
export function useExcludeRepos({onCompleted, onError}) {
  return useMutation(EXCLUDE_REPOSITORIES, {onCompleted, onError});
}

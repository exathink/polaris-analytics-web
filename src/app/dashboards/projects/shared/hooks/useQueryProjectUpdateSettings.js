import {useMutation, gql} from "@apollo/client";

export const PROJECT_UPDATE_SETTINGS = gql`
  mutation projectUpdateSettings($projectKey: String!, $flowMetricsSettings: FlowMetricsSettingsInput) {
    updateProjectSettings(updateProjectSettingsInput: {key: $projectKey, flowMetricsSettings: $flowMetricsSettings}) {
      success
      errorMessage
    }
  }
`;
export function useProjectUpdateSettings({onCompleted, onError}) {
  return useMutation(PROJECT_UPDATE_SETTINGS, {onCompleted, onError});
}

import {useMutation, gql} from "@apollo/client";
import {capitalizeFirstLetter} from "../../../helpers/utility";

export const DIMENSION_UPDATE_SETTINGS = (dimension) => gql`
  mutation ${dimension}UpdateSettings($instanceKey: String!, $name: String, $flowMetricsSettings: FlowMetricsSettingsInput, $analysisPeriods: AnalysisPeriodsInput, $wipInspectorSettings: WipInspectorSettingsInput, $releasesSettings: ReleasesSettingsInput) {
    update${capitalizeFirstLetter(dimension)}Settings(update${capitalizeFirstLetter(dimension)}SettingsInput: {key: $instanceKey, name: $name, flowMetricsSettings: $flowMetricsSettings, analysisPeriods: $analysisPeriods, wipInspectorSettings: $wipInspectorSettings, releasesSettings: $releasesSettings}) {
      success
      errorMessage
    }
  }
`;
export function useDimensionUpdateSettings({dimension, onCompleted, onError}) {
  return useMutation(DIMENSION_UPDATE_SETTINGS(dimension), {onCompleted, onError});
}

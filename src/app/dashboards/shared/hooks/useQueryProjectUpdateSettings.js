import {useMutation, gql} from "@apollo/client";
import {capitalizeFirstLetter} from "../../../helpers/utility";

export const DIMENSION_UPDATE_SETTINGS = (dimension) => gql`
  mutation ${dimension}UpdateSettings($instanceKey: String!, $flowMetricsSettings: FlowMetricsSettingsInput, $analysisPeriods: AnalysisPeriodsInput, $wipInspectorSettings: WipInspectorSettingsInput) {
    update${capitalizeFirstLetter(dimension)}Settings(update${capitalizeFirstLetter(dimension)}SettingsInput: {key: $instanceKey, flowMetricsSettings: $flowMetricsSettings, analysisPeriods: $analysisPeriods, wipInspectorSettings: $wipInspectorSettings}) {
      success
      errorMessage
    }
  }
`;
export function useDimensionUpdateSettings({dimension, onCompleted, onError}) {
  return useMutation(DIMENSION_UPDATE_SETTINGS(dimension), {onCompleted, onError});
}

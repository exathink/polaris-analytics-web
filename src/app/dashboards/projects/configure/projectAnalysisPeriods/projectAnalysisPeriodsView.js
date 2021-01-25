import React from "react";
import {actionTypes, mode} from "./constants";
import {analysisPeriodsReducer} from "./analysisPeriodsReducer";
import {Alert, Button} from "antd";
import {useProjectUpdateSettings} from "../../shared/hooks/useQueryProjectUpdateSettings";
import {logGraphQlError} from "../../../../components/graphql/utils";
import {Flex} from "reflexbox";
import "./projectAnalysisPeriods.css";
import {AnalysisPeriodsSliders} from "./analysisPeriodsSliders";

export const ProjectAnalysisPeriodsView = ({
  instanceKey,
  wipAnalysisPeriod,
  flowAnalysisPeriod,
  trendsAnalysisPeriod,
}) => {
  // mutation to update project analysis periods
  const [mutate, {loading, error, client}] = useProjectUpdateSettings({
    onCompleted: ({updateProjectSettings: {success, errorMessage}}) => {
      if (success) {
        dispatch({type: actionTypes.MUTATION_SUCCESS});
        client.resetStore();
      }
    },
    onError: (error) => {
      logGraphQlError("ProjectAnalysisPeriodsView.useProjectUpdateSettings", error);
    },
  });

  // after mutation is successful,we are invalidating active quries.
  // we need to update default settings from api response, this useEffect will serve the purpose.
  React.useEffect(() => {
    dispatch({
      type: actionTypes.UPDATE_DEFAULTS,
      payload: {wipAnalysisPeriod, flowAnalysisPeriod, trendsAnalysisPeriod},
    });
  }, [wipAnalysisPeriod, flowAnalysisPeriod, trendsAnalysisPeriod]);

  const initialState = {
    wipPeriod: wipAnalysisPeriod,
    flowPeriod: flowAnalysisPeriod,
    trendsPeriod: trendsAnalysisPeriod,
    initialAnalysisPeriods: {wipAnalysisPeriod, flowAnalysisPeriod, trendsAnalysisPeriod},
    mode: mode.INIT,
  };

  const [state, dispatch] = React.useReducer(analysisPeriodsReducer, initialState);
  const sliderProps = {...state, dispatch};

  function handleSaveClick() {
    const payload = {
      wipAnalysisPeriod: state.wipPeriod,
      flowAnalysisPeriod: state.flowPeriod,
      trendsAnalysisPeriod: state.trendsPeriod,
    };

    // call mutation on save button click
    mutate({
      variables: {
        projectKey: instanceKey,
        analysisPeriods: payload,
      },
    });
  }

  function handleCancelClick() {
    dispatch({type: actionTypes.RESET_SLIDERS});
  }

  function getButtonElements() {
    // when mutation is executing
    if (loading) {
      return (
        <Button className={"shiftRight"} type="primary" loading>
          Processing...
        </Button>
      );
    }

    if (state.mode === mode.EDITING) {
      return (
        <>
          <Button onClick={handleSaveClick} className="analysisSave" type="primary" size="small" shape="round">
            Save
          </Button>
          <Button onClick={handleCancelClick} className="analysisCancel" type="default" size="small" shape="round">
            Cancel
          </Button>
        </>
      );
    }

    if (state.mode === mode.SUCCESS) {
      return (
        <Alert
          message="Analysis Periods updated successfully."
          type="success"
          showIcon
          closable
          className="shiftRight"
          onClose={() => dispatch({type: actionTypes.CLOSE_SUCCESS_MODAL})}
        />
      );
    }
  }

  if (error) {
    logGraphQlError("ProjectAnalysisPeriodsView.useProjectUpdateSettings", error);
    return null;
  }

  return (
    <div className="analysisPeriodControlsWrapper" data-testid="analysis-periods-view">
      <div className="analysisPeriodTopBar">
        <div className="analysisPeriodTitle">Drag sliders to update analysis periods</div>
        <div className="analysisPeriodsButtons">{getButtonElements()}</div>
      </div>
      <AnalysisPeriodsSliders {...sliderProps} />
    </div>
  );
};

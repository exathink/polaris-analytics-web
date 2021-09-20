import React from "react";
import {actionTypes, mode} from "./constants";
import {analysisPeriodsReducer} from "./analysisPeriodsReducer";
import {Alert} from "antd";
import {useProjectUpdateSettings} from "../../shared/hooks/useQueryProjectUpdateSettings";
import {logGraphQlError} from "../../../../components/graphql/utils";
import styles from "./projectAnalysisPeriods.module.css";
import {AnalysisPeriodsSliders} from "./analysisPeriodsSliders";
import Button from "../../../../../components/uielements/button";
import {InfoCard} from "../../../../components/misc/info";

const analysisPeriodItems = [
  {
    id: "wipAnalysisPeriod",
    title: "Wip Analysis Window",
    info: (
      <>
        <p>The analysis period to benchmark cycle time for work items in progress against recently closed items.</p>{" "}
        <p>
          The cycle time SLA as well as metrics for closed items in the Wip dashboard use this period by default.{" "}
        </p>{" "}
        <p>
          This value should be atleast as large as the cycle time SLA value. The value selected here becomes the
          default Wip analysis period for this value stream for all users.
        </p>
      </>
    ),
  },
  {
    id: "flowAnalysisPeriod",
    title: "Flow Analysis Window",
    info: (
      <>
        <p>The default analysis period to analyze flow metrics for value stream in Flow dashboard.</p>{" "}
        <p>This value must be larger than the Wip analysis window and typically is 2-4x the Wip analysis period. </p>{" "}
        <p>
          This value must be larger than the flow analysis window and typically is 1.5-4x the Wip analysis period. The
          value selected here becomes the default analysis period for the Flow dashboard for all users.
        </p>
      </>
    ),
  },
  {
    id: "trendsAnalysisPeriod",
    title: "Trends Analysis Window",
    info: (
      <>
        <p>
          The default analysis period for showing longer term trends for the Value Stream in the trends dashboard.{" "}
        </p>
        <p>
          This value must be larger than the flow analysis window and typically is 1.5-4x the Wip analysis period.
        </p>{" "}
        <p>The value selected here becomes the default analysis period for the Trends dashboard for all users. </p>
      </>
    ),
  },
];

export const ProjectAnalysisPeriodsView = ({
  instanceKey,
  wipAnalysisPeriod,
  flowAnalysisPeriod,
  trendsAnalysisPeriod,
}) => {
  const initialState = {
    wipPeriod: wipAnalysisPeriod,
    flowPeriod: flowAnalysisPeriod,
    trendsPeriod: trendsAnalysisPeriod,
    initialAnalysisPeriods: {wipAnalysisPeriod, flowAnalysisPeriod, trendsAnalysisPeriod},
    mode: mode.INIT,
    errorMessage: "",
  };

  const [state, dispatch] = React.useReducer(analysisPeriodsReducer, initialState);
  const sliderProps = {...state, dispatch};

  // mutation to update project analysis periods
  const [mutate, {loading, client}] = useProjectUpdateSettings({
    onCompleted: ({updateProjectSettings: {success, errorMessage}}) => {
      if (success) {
        dispatch({type: actionTypes.MUTATION_SUCCESS});
        client.resetStore();
      } else {
        logGraphQlError("ProjectAnalysisPeriodsView.useProjectUpdateSettings", errorMessage);
        dispatch({type: actionTypes.MUTATION_FAILURE, payload: errorMessage});
      }
    },
    onError: (error) => {
      logGraphQlError("ProjectAnalysisPeriodsView.useProjectUpdateSettings", error);
      dispatch({type: actionTypes.MUTATION_FAILURE, payload: error.message});
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
          <Button onClick={handleSaveClick} className={styles["analysisSave"]} type="primary" size="small" shape="round">
            Save
          </Button>
          <Button onClick={handleCancelClick} type="default" size="small" shape="round">
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
          className={styles["shiftRight"]}
          onClose={() => dispatch({type: actionTypes.CLOSE_SUCCESS_MODAL})}
        />
      );
    }

    if (state.mode === mode.ALERT) {
      return (
        <Alert
          message={state.errorMessage}
          type="warning"
          showIcon
          closable
          className={styles["shiftRight"]}
          onClose={() => dispatch({type: actionTypes.CLOSE_ALERT_MODAL})}
        />
      );
    }

    if (state.mode === mode.ERROR) {
      return (
        <Alert
          message={state.errorMessage}
          type="error"
          showIcon
          closable
          className={styles["shiftRight"]}
          onClose={() => dispatch({type: actionTypes.RESET_SLIDERS})}
        />
      );
    }

  }

  function getInfoDrawer() {
    return (
      <div className={styles.infoDrawer}>
        <InfoCard
          drawerOptions={{
            placement: "right",
            width: "40vw",
          }}
          title={"Analysis Periods Settings"}
          drawerContent={
            <div className={styles.analysisInfoItems}>
              {analysisPeriodItems.map((item) => {
                return (
                  <div className={styles.itemWrapper} key={item.id}>
                    <div className={styles.title}>{item.title}</div>
                    <div className={styles["analysis-info"]}>{item.info}</div>
                  </div>
                );
              })}
            </div>
          }
          className={""}
        />
      </div>
    );
  }

  return (
    <div className={styles["analysisPeriodControlsWrapper"]} data-testid="analysis-periods-view">
      <div className={styles["analysisPeriodTopBar"]}>
        <div className={styles["analysisPeriodsButtons"]} data-testid="analysis-period-buttons">{getButtonElements()}</div>
      </div>
      <div className={styles["titleWrapper"]}>
         <div className={styles["analysisPeriodTitle"]}>Analysis Periods</div>

      </div>
      <AnalysisPeriodsSliders {...sliderProps} />
      
    </div>
  );
};

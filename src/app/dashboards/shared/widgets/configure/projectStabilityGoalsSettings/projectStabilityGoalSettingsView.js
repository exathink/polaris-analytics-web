import React from "react";
import {FlowMetricsScatterPlotChart} from "../../../charts/flowMetricCharts/flowMetricsScatterPlotChart";
import {projectDeliveryCycleFlowMetricsMeta} from "../../../helpers/metricsMeta";
import {METRICS, actionTypes, mode} from "./constants";
import {settingsReducer} from "./settingsReducer";
import {Alert} from "antd";
import {useDimensionUpdateSettings} from "../../../hooks/useQueryProjectUpdateSettings";
import {logGraphQlError} from "../../../../../components/graphql/utils";
import {GroupingSelector} from "../../../components/groupingSelector/groupingSelector";
import {Flex} from "reflexbox";
import styles from "./projectResponseTimeSLASettings.module.css";
import {TargetSliders} from "./targetSliders";
import {CardInspectorWithDrawer, useCardInspector} from "../../../../work_items/cardInspector/cardInspectorUtils";
import {capitalizeFirstLetter, pick} from "../../../../../helpers/utility";
import Button from "../../../../../../components/uielements/button";

const groupings = [
  {
    key: METRICS.CYCLE_TIME,
    display: "Work Item Cycle Time",
  },
  {
    key: METRICS.LEAD_TIME,
    display: "Work Item Lead Time",
  }
]



export const ProjectStabilityGoalSettingsView = ({
  data,
  dimension,
  instanceKey,
  context,
  days,
  targetMetrics,
  defectsOnly,
  specsOnly,
  initialMetric=METRICS.CYCLE_TIME,
  setSelectedMetric
}) => {
  const model = React.useMemo(
    () =>
      data[dimension].workItemDeliveryCycles.edges.map((edge) =>
        pick(
          edge.node,
          "id",
          "name",
          "key",
          "displayId",
          "workItemKey",
          "workItemType",
          "state",
          "startDate",
          "endDate",
          "leadTime",
          "cycleTime",
          "latency",
          "duration",
          "effort",
          "authorCount"
        )
      ),
    [data, dimension]
  );

  const initialState = {
    selectedMetric: METRICS.CYCLE_TIME,
    leadTime: {
      target: targetMetrics.leadTimeTarget,
      confidence: targetMetrics.leadTimeConfidenceTarget,
      initialTarget: targetMetrics.leadTimeTarget,
      initialConfidence: targetMetrics.leadTimeConfidenceTarget,
    },
    cycleTime: {
      target: targetMetrics.cycleTimeTarget,
      confidence: targetMetrics.cycleTimeConfidenceTarget,
      initialTarget: targetMetrics.cycleTimeTarget,
      initialConfidence: targetMetrics.cycleTimeConfidenceTarget,
    },
    mode: mode.INIT,
    errorMessage: "",
  };

  const [state, dispatch] = React.useReducer(settingsReducer, initialState);

  // mutation to update project settings
  const [mutate, {loading, client}] = useDimensionUpdateSettings({
    dimension: dimension,
    onCompleted: ({[`update${capitalizeFirstLetter(dimension)}Settings`]: {success, errorMessage}}) => {
      if (success) {
        dispatch({type: actionTypes.MUTATION_SUCCESS});
        client.resetStore();
      } else {
        logGraphQlError("ProjectResponseTimeSLASettingsView.useDimensionUpdateSettings", errorMessage);
        dispatch({type: actionTypes.MUTATION_FAILURE, payload: errorMessage});
      }
    },
    onError: (error) => {
      logGraphQlError("ProjectResponseTimeSLASettingsView.useDimensionUpdateSettings", error);
      dispatch({type: actionTypes.MUTATION_FAILURE, payload: error.message});
    },
  });

  // after mutation is successful,we are invalidating active quries.
  // we need to update default settings from api response, this useEffect will serve the purpose.
  React.useEffect(() => {
    dispatch({
      type: actionTypes.UPDATE_DEFAULTS,
      payload: targetMetrics,
    });
  }, [targetMetrics]);

  const {leadTime, cycleTime, selectedMetric} = state;

  const metricTarget = selectedMetric === "leadTime" ? leadTime.target : cycleTime.target;
  const targetConfidence = selectedMetric === "leadTime" ? leadTime.confidence : cycleTime.confidence;

  const sliderProps = {...state, dispatch};

  const {workItemKey, setWorkItemKey, showPanel, setShowPanel} = useCardInspector();

  function handleSaveClick() {
    const payload = {
      leadTimeTarget: leadTime.target,
      leadTimeConfidenceTarget: leadTime.confidence,
      cycleTimeTarget: cycleTime.target,
      cycleTimeConfidenceTarget: cycleTime.confidence,
    };

    // call mutation on save button click
    mutate({
      variables: {
        instanceKey: instanceKey,
        flowMetricsSettings: payload,
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
        <Button className={styles["shiftRight"]} type="primary" loading>
          Processing...
        </Button>
      );
    }

    if (state.mode === mode.EDITING) {
      return (
        <>
          <Button onClick={handleSaveClick} className={styles["targetSave"]} type="primary" size="small" shape="round">
            Save
          </Button>
          <Button onClick={handleCancelClick} className={styles["targetCancel"]} type="default" size="small" shape="round">
            Cancel
          </Button>
        </>
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

    if (state.mode === mode.SUCCESS) {
      return (
        <Alert
          message="Settings updated successfully."
          type="success"
          showIcon
          closable
          className={styles["shiftRight"]}
          onClose={() => dispatch({type: actionTypes.CLOSE_SUCCESS_MODAL})}
        />
      );
    }
  }

  return (
    <React.Fragment>
      <div className={styles["flowMetricControlsWrapper"]} data-testid="flowmetrics-setting-view">
        <Flex w={1} justify={"center"}>
          <span>Drag sliders to update stability goal and confidence %</span>
        </Flex>
        <Flex w={1} className={styles["selectedMetricWrapper"]}>
          <GroupingSelector
            label={" "}
            groupings={groupings}
            initialValue={selectedMetric}
            onGroupingChanged={(newState) => {
              dispatch({ type: actionTypes.UPDATE_METRIC, payload: newState });
              setSelectedMetric(newState);
            }}
          />
          <div className={styles["targetControlButtons"]}>{getButtonElements()}</div>
        </Flex>
        <TargetSliders {...sliderProps} />
      </div>
      <FlowMetricsScatterPlotChart
        days={days}
        model={model}
        selectedMetric={selectedMetric}
        metricsMeta={projectDeliveryCycleFlowMetricsMeta}
        metricTarget={metricTarget}
        targetConfidence={targetConfidence}
        defectsOnly={defectsOnly}
        specsOnly={specsOnly}
        yAxisScale={"logarithmic"}
        onSelectionChange={(workItems) => {
          if (workItems.length === 1) {
            setShowPanel(true);
            setWorkItemKey(workItems[0].workItemKey);
          }
        }}
      />
      <CardInspectorWithDrawer
        workItemKey={workItemKey}
        showPanel={showPanel}
        setShowPanel={setShowPanel}
        context={context}
      />
    </React.Fragment>
  );
};

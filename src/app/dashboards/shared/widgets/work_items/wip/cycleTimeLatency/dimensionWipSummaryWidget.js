import {Loading} from "../../../../../../components/graphql/loading";
import {logGraphQlError} from "../../../../../../components/graphql/utils";
import { useWipQuery } from "../../../../../../helpers/hooksUtil";
import {getReferenceString} from "../../../../../../helpers/utility";

import { useQueryDimensionFlowMetrics } from "../../closed/flowMetrics/useQueryDimensionFlowMetrics";
import {WorkInProgressSummaryView} from "../flowMetrics/wipFlowMetricsSummaryView";

export function DimensionWipSummaryWidget({
  dimension,
  instanceKey,
  tags,
  release,
  specsOnly,
  latestWorkItemEvent,
  latestCommit,
  targetPercentile,
  leadTimeTargetPercentile,
  leadTimeTarget,
  cycleTimeTargetPercentile,
  cycleTimeTarget,
  latencyTarget,
  includeSubTasks,
  days,
  view,
  displayBag,
  displayProps
}) {

  const dimensionSettings = {dimension, key: instanceKey, latestWorkItemEvent, latestCommit, settingsWithDefaults: {includeSubTasksWipInspector: includeSubTasks}};
  const {loading, error, data: wipDataAll} = useWipQuery({dimensionSettings});

  const {loading: loading1, error: error1, data: flowMetricsData} = useQueryDimensionFlowMetrics({
    dimension,
    instanceKey,
    leadTimeTarget,
    tags,
    release,
    cycleTimeTarget,
    leadTimeTargetPercentile,
    cycleTimeTargetPercentile,
    days: days,
    measurementWindow: days,
    samplingFrequency: days,
    specsOnly: specsOnly,
    includeSubTasks: includeSubTasks,
    referenceString: getReferenceString(latestWorkItemEvent, latestCommit),
  });

  if (loading || loading1) return <Loading />;
  if (error) {
    logGraphQlError("DimensionWipSummaryWidget.useWipQuery", error);
    return null;
  }
  if (error1) {
    logGraphQlError("DimensionWipMetricsWidget.useQueryDimensionFlowMetrics", error1);
    return null;
  }

  return (
    <WorkInProgressSummaryView
      wipDataAll={wipDataAll}
      flowMetricsData={flowMetricsData}
      dimension={dimension}
      specsOnly={specsOnly}
      cycleTimeTarget={cycleTimeTarget}
      latencyTarget={latencyTarget}
      days={days}
      displayBag={displayBag}
    />
  );
}

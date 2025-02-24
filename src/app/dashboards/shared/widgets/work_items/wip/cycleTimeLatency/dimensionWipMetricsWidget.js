import {Loading} from "../../../../../../components/graphql/loading";
import {logGraphQlError} from "../../../../../../components/graphql/utils";
import { useWipQuery } from "../../../../../../helpers/hooksUtil";
import {getReferenceString} from "../../../../../../helpers/utility";
import {DimensionWipMetricsView} from "./dimensionWipMetricsView";
import {useQueryDimensionFlowMetricsTrends} from "../../hooks/useQueryDimensionFlowMetricsTrends";

export function DimensionWipMetricsWidget({
  dimension,
  instanceKey,
  tags,
  release,
  displayBag,
  excludeMotionless,
  targetPercentile,
  leadTimeTargetPercentile,
  cycleTimeTargetPercentile,
  cycleTimeTarget,
  latencyTarget,
  leadTimeTarget,
  specsOnly,
  latestCommit,
  latestWorkItemEvent,

  flowAnalysisPeriod = 30,
  includeSubTasks,
}) {

  const {
    loading: loading1,
    error: error1,
    data: flowMetricsData,
  } = useQueryDimensionFlowMetricsTrends({
    dimension,
    instanceKey,
    release,
    tags,
    leadTimeTarget,
    cycleTimeTarget,
    targetPercentile,
    days: flowAnalysisPeriod,
    measurementWindow: flowAnalysisPeriod,
    samplingFrequency: flowAnalysisPeriod,
    specsOnly: specsOnly,
    includeSubTasks: includeSubTasks,
    referenceString: getReferenceString(latestWorkItemEvent, latestCommit),
  });

  const dimensionSettings = {dimension, key: instanceKey, latestWorkItemEvent, latestCommit, settingsWithDefaults: {includeSubTasksWipInspector: includeSubTasks}};
  const {loading: loading2, error: error2, data: wipDataAll} = useWipQuery({dimensionSettings});

  if (loading1 || loading2) return <Loading />;

  if (error1) {
    logGraphQlError("DimensionWipMetricsWidget.useQueryDimensionFlowMetrics", error1);
    return null;
  }
  if (error2) {
    logGraphQlError("DimensionWipMetricsWidget.useWipQuery", error2);
    return null;
  }

  return (
    <DimensionWipMetricsView
      wipDataAll={wipDataAll}
      flowMetricsData={flowMetricsData}
      specsOnly={specsOnly}
      dimension={dimension}
      instanceKey={instanceKey}
      displayBag={displayBag}
      excludeMotionless={excludeMotionless}
      cycleTimeTarget={cycleTimeTarget}
      latencyTarget={latencyTarget}
      days={flowAnalysisPeriod}
    />
  );
}

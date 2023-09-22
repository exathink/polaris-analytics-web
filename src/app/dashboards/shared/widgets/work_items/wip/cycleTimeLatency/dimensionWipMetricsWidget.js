import {Loading} from "../../../../../../components/graphql/loading";
import {logGraphQlError} from "../../../../../../components/graphql/utils";
import {getReferenceString} from "../../../../../../helpers/utility";
import { useWipQuery } from "../../../../../projects/projectDashboard";
import {useQueryDimensionFlowMetrics} from "../../closed/flowMetrics/useQueryDimensionFlowMetrics";
import {DimensionWipMetricsView} from "./dimensionWipMetricsView";

export function DimensionWipMetricsWidget({
  dimension,
  instanceKey,
  tags,
  release,
  displayBag,
  excludeAbandoned,
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
  } = useQueryDimensionFlowMetrics({
    dimension,
    instanceKey,
    tags,
    leadTimeTarget,
    cycleTimeTarget,
    leadTimeTargetPercentile,
    cycleTimeTargetPercentile,
    days: flowAnalysisPeriod,
    measurementWindow: flowAnalysisPeriod,
    samplingFrequency: flowAnalysisPeriod,
    specsOnly: specsOnly,
    includeSubTasks: includeSubTasks,
    referenceString: getReferenceString(latestWorkItemEvent, latestCommit),
  });

  const {loading: loading2, error: error2, data: wipDataAll} = useWipQuery();

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
      excludeAbandoned={excludeAbandoned}
      cycleTimeTarget={cycleTimeTarget}
      latencyTarget={latencyTarget}
      days={flowAnalysisPeriod}
    />
  );
}

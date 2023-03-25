import React from "react";
import {Loading} from "../../../../../../components/graphql/loading";
import {WorkInProgressFlowMetricsView} from "./wipFlowMetricsSummaryView";
import {getReferenceString} from "../../../../../../helpers/utility";
import {useQueryDimensionFlowMetrics} from "../../closed/flowMetrics/useQueryDimensionFlowMetrics";

export const DimensionWipFlowMetricsWidget = ({
  dimension,
  instanceKey,
  tags,
  specsOnly,
  days,
  latestCommit,
  latestWorkItemEvent,
  leadTimeTarget,
  leadTimeTargetPercentile,
  cycleTimeTargetPercentile,
  cycleTimeTarget,
  view,
  includeSubTasks,
}) => {
  const {loading, error, data} = useQueryDimensionFlowMetrics({
    dimension,
    instanceKey,
    tags,
    leadTimeTarget,
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

  if (loading) return <Loading />;
  if (error) return null;

  if (view === "primary") {
    return (
      <WorkInProgressFlowMetricsView
        data={data}
        dimension={dimension}
        cycleTimeTarget={cycleTimeTarget}
        specsOnly={specsOnly}
        days={days}
      />
    );
  } else {
    return null;
  }
};

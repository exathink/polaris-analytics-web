import {Loading} from "../../../../../components/graphql/loading";
import React from "react";
import {getReferenceString} from "../../../../../helpers/utility";
import {useQueryDimensionFlowMetricsTrends} from "../../../../shared/widgets/work_items/hooks/useQueryDimensionFlowMetricsTrends";
import {logGraphQlError} from "../../../../../components/graphql/utils";
import {FlowMetricsView} from "./flowMetricsView";

export const FlowMetricsTrendsWidget = ({
  dimension,
  instanceKey,
  displayBag,
  flowAnalysisPeriod,
  trendAnalysisPeriod,
  targetPercentile,
  cycleTimeTarget,
  specsOnly,
  latestCommit,
  latestWorkItemEvent,
  includeSubTasks,
  view
}) => {
  // Summary Card Data
  // Throughput for a single measurement period
  // There will always be 2 data points in this trend, the trend value compares the difference between the first and the second data point
  // days = measurementWindow = samplingFrequency
  // days is set to flowAnalysisPeriod by default

  const {loading, error, data} = useQueryDimensionFlowMetricsTrends({
    dimension,
    instanceKey,
    days: flowAnalysisPeriod,
    measurementWindow: flowAnalysisPeriod,
    samplingFrequency: flowAnalysisPeriod,
    targetPercentile,
    includeSubTasks,
    referenceString: getReferenceString(latestCommit, latestWorkItemEvent),
  });
  if (loading) return <Loading />;
  if (error) {
    logGraphQlError("FlowMetricsTrendsWidget.useQueryDimensionFlowMetricsTrends", error);
    return null;
  }

  return (
    <FlowMetricsView
      data={data}
      dimension={dimension}
      instanceKey={instanceKey}
      displayBag={displayBag}
      flowAnalysisPeriod={flowAnalysisPeriod}
      trendAnalysisPeriod={trendAnalysisPeriod}
      targetPercentile={targetPercentile}
      cycleTimeTarget={cycleTimeTarget}
      specsOnly={specsOnly}
      latestCommit={latestCommit}
      latestWorkItemEvent={latestWorkItemEvent}
      includeSubTasks={includeSubTasks}
      view={view}
    />
  );
};

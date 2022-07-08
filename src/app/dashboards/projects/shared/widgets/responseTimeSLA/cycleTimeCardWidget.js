import {Loading} from "../../../../../components/graphql/loading";
import React from "react";
import {getReferenceString} from "../../../../../helpers/utility";
import {useQueryDimensionFlowMetricsTrends} from "../../../../shared/widgets/work_items/hooks/useQueryDimensionFlowMetricsTrends";
import {logGraphQlError} from "../../../../../components/graphql/utils";
import {CycleTimeCardView} from "./cycleTimeCardView";

export const CycleTimeCardWidget = ({
  dimension,
  instanceKey,
  displayType,
  flowAnalysisPeriod,
  trendAnalysisPeriod,
  targetPercentile,
  cycleTimeTarget,
  specsOnly,
  latestWorkItemEvent,
  latestCommit,
  includeSubTasks,
  view,
}) => {
  // Summary Card Data
  // CycleTime for a single measurement period
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
    logGraphQlError("CycleTimeCardWidget.useQueryDimensionFlowMetricsTrends", error);
    return null;
  }

  return (
    <CycleTimeCardView
      data={data}
      dimension={dimension}
      instanceKey={instanceKey}
      displayType={displayType}
      flowAnalysisPeriod={flowAnalysisPeriod}
      trendAnalysisPeriod={trendAnalysisPeriod}
      specsOnly={specsOnly}
      latestCommit={latestCommit}
      latestWorkItemEvent={latestWorkItemEvent}
      includeSubTasks={includeSubTasks}
      targetPercentile={targetPercentile}
      cycleTimeTarget={cycleTimeTarget}
    />
  );
};

import {Loading} from "../../../../../components/graphql/loading";
import React from "react";
import {getReferenceString} from "../../../../../helpers/utility";
import {useQueryDimensionFlowMetricsTrends} from "../../../../shared/widgets/work_items/hooks/useQueryDimensionFlowMetricsTrends";
import {logGraphQlError} from "../../../../../components/graphql/utils";
import {ThroughputCardView} from "../../../../shared/widgets/work_items/wip/flowMetrics/wipFlowMetricsSummaryView";

export const ThroughputCardWidget = ({
  dimension,
  instanceKey,
  flowAnalysisPeriod,
  trendAnalysisPeriod,
  targetPercentile,
  specsOnly,
  latestWorkItemEvent,
  latestCommit,
  includeSubTasks,
  view,
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
    logGraphQlError("ThroughputCardWidget.useQueryDimensionFlowMetricsTrends", error);
    return null;
  }

  return (
    <ThroughputCardView
      data={data}
      dimension={dimension}
      flowAnalysisPeriod={flowAnalysisPeriod}
      trendAnalysisPeriod={trendAnalysisPeriod}
      specsOnly={specsOnly}
    />
  );
};

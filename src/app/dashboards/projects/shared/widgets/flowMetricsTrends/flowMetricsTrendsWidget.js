import {Loading} from "../../../../../components/graphql/loading";
import React from "react";
import {getReferenceString} from "../../../../../helpers/utility";
import {useQueryDimensionFlowMetricsTrends} from "../../../../shared/widgets/work_items/hooks/useQueryDimensionFlowMetricsTrends";
import {logGraphQlError} from "../../../../../components/graphql/utils";
import {FlowMetricsView} from "./flowMetricsView";

export const FlowMetricsTrendsWidget = ({
  dimension,
  instanceKey,
  tags,
  release,
  displayBag,

  days,
  measurementWindow,
  samplingFrequency,

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


  const {loading, error, data} = useQueryDimensionFlowMetricsTrends({
    dimension,
    instanceKey,
    tags,
    release,
    days: days,
    measurementWindow: measurementWindow,
    samplingFrequency: samplingFrequency,
    targetPercentile,
    includeSubTasks,
    specsOnly,
    referenceString: getReferenceString(latestWorkItemEvent, latestCommit),
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
      tags={tags}
      release={release}
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

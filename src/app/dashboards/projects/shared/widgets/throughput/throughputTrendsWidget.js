import React from "react";
import {Loading} from "../../../../../components/graphql/loading";
import {logGraphQlError} from "../../../../../components/graphql/utils";
import {getReferenceString} from "../../../../../helpers/utility";
import {useQueryDimensionFlowMetricsTrends} from "../../../../shared/widgets/work_items/hooks/useQueryDimensionFlowMetricsTrends";
import {ThroughputTrendsView} from "./throughputViews";

export function ThroughputTrendsWidget({
  dimension,
  instanceKey,
  tags,
  days,
  measurementWindow,
  samplingFrequency,
  targetPercentile,
  includeSubTasks,
  latestCommit,
  latestWorkItemEvent,
  view,
  context,
  specsOnly,
  displayBag
}) {
  const {loading, error, data} = useQueryDimensionFlowMetricsTrends({
    dimension,
    instanceKey,
    days: days,
    tags:tags,
    measurementWindow: measurementWindow,
    samplingFrequency: samplingFrequency,
    targetPercentile,
    includeSubTasks,
    referenceString: getReferenceString(latestCommit, latestWorkItemEvent),
  });

  if (loading) return <Loading />;
  if (error) {
    logGraphQlError("ThroughputTrendsWidget.useQueryDimensionFlowMetricsTrends", error);
    return null;
  }

  return (
    <ThroughputTrendsView
      data={data}
      dimension={dimension}
      targetPercentile={targetPercentile}
      measurementWindow={measurementWindow}
      measurementPeriod={days}
      view={view}
      specsOnly={specsOnly}
      displayBag={displayBag}
    />
  );
}

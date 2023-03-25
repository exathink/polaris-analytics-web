import React from "react";
import {Loading} from "../../../../../../components/graphql/loading";
import {logGraphQlError} from "../../../../../../components/graphql/utils";
import {getReferenceString} from "../../../../../../helpers/utility";
import {CardDetailsWidget} from "../../closed/flowMetrics/dimensionCardDetailsWidget";
import {useQueryDimensionFlowMetricsTrends} from "../../hooks/useQueryDimensionFlowMetricsTrends";
import {VolumeTrendsTableView} from "./volumeTrendsTableView";

export function VolumeTrendsTableWidget({
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
}) {
  const [before, setBefore] = React.useState();

  const {loading, error, data} = useQueryDimensionFlowMetricsTrends({
    dimension,
    instanceKey,
    tags,
    days,
    measurementWindow,
    samplingFrequency,
    targetPercentile,
    includeSubTasks,
    referenceString: getReferenceString(latestCommit, latestWorkItemEvent),
  });

  if (loading) return <Loading />;
  if (error) {
    logGraphQlError("VolumeTrendsTableWidget.useQueryDimensionFlowMetricsTrends", error);
    return null;
  }

  const cardDetailsWidget = (
    <CardDetailsWidget
      dimension={dimension}
      instanceKey={instanceKey}
      tags={tags}
      days={measurementWindow}
      initialDays={days}
      specsOnly={specsOnly}
      before={before}
      includeSubTasks={includeSubTasks}
      latestWorkItemEvent={latestWorkItemEvent}
      view={view}
      context={context}
    />
  );
  return (
    <VolumeTrendsTableView
      data={data}
      dimension={dimension}
      targetPercentile={targetPercentile}
      measurementWindow={measurementWindow}
      measurementPeriod={days}
      view={view}
      before={before}
      specsOnly={specsOnly}
      setBefore={setBefore}
      cardDetailsWidget={cardDetailsWidget}
    />
  );
}

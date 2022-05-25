import React from "react";
import {Loading} from "../../../../../../components/graphql/loading";
import {logGraphQlError} from "../../../../../../components/graphql/utils";
import {getReferenceString} from "../../../../../../helpers/utility";
import { useQueryProjectClosedDeliveryCycleDetail } from "../../../../../projects/shared/hooks/useQueryProjectClosedDeliveryCycleDetail";
import {useQueryDimensionFlowMetricsTrends} from "../../hooks/useQueryDimensionFlowMetricsTrends";
import {VolumeTrendsTableView} from "./volumeTrendsTableView";

export function VolumeTrendsTableWidget({
  dimension,
  instanceKey,
  days,
  measurementWindow,
  samplingFrequency,
  targetPercentile,
  includeSubTasks,
  latestCommit,
  latestWorkItemEvent,
  view,
  context
}) {
  const [before, setBefore] = React.useState();

  const {loading, error, data} = useQueryDimensionFlowMetricsTrends({
    dimension,
    instanceKey,
    days,
    measurementWindow,
    samplingFrequency,
    targetPercentile,
    includeSubTasks,
    referenceString: getReferenceString(latestCommit, latestWorkItemEvent),
  });
  const {loading: loading1, error: error1, data: data1} = useQueryProjectClosedDeliveryCycleDetail({
    dimension,
    instanceKey,
    days,
    specsOnly: false,
    before,
    includeSubTasks,
    referenceString: latestWorkItemEvent,
  });

  if (loading || loading1) return <Loading />;
  if (error || error1) {
    logGraphQlError("VolumeTrendsTableWidget.useQueryDimensionFlowMetricsTrends", error);
    return null;
  }

  return (
    <VolumeTrendsTableView
      data={data}
      tableData={data1}
      dimension={dimension}
      targetPercentile={targetPercentile}
      measurementWindow={measurementWindow}
      measurementPeriod={days}
      view={view}
      before={before}
      setBefore={setBefore}
      context={context}
    />
  );
}

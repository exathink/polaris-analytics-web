import React from "react";
import {Loading} from "../../../../../../components/graphql/loading";
import {useQueryProjectClosedDeliveryCycleDetail} from "../../../../../projects/shared/hooks/useQueryProjectClosedDeliveryCycleDetail";
import {logGraphQlError} from "../../../../../../components/graphql/utils";
import {DimensionCycleTimeHistogramView} from "./dimensionDeliveryCyclesFlowMetricsView";

export const DimensionCycleTimeHistogramWidget = ({
  dimension,
  instanceKey,
  specsOnly,
  latestWorkItemEvent,
  days,
  before,
  defectsOnly,
  includeSubTasks,
}) => {
  const {loading, error, data} = useQueryProjectClosedDeliveryCycleDetail({
    dimension,
    instanceKey,
    days: days,
    defectsOnly,
    specsOnly,
    before,
    includeSubTasks,
    referenceString: latestWorkItemEvent,
  });

  if (loading) return <Loading />;
  if (error) {
    logGraphQlError("DimensionDeliveryCycleFlowMetricsWidget.useQueryProjectClosedDeliveryCycleDetail", error);
    return null;
  }

  return <DimensionCycleTimeHistogramView data={data} dimension={dimension} specsOnly={specsOnly} days={days} before={before}/>;
};

import React from "react";
import {Loading} from "../../../../../../components/graphql/loading";
import {DimensionDeliveryCyclesFlowMetricsView} from "./dimensionDeliveryCyclesFlowMetricsView";
import {useQueryProjectClosedDeliveryCycleDetail} from "../../../../../projects/shared/hooks/useQueryProjectClosedDeliveryCycleDetail";
import {logGraphQlError} from "../../../../../../components/graphql/utils";

export const DimensionDeliveryCycleFlowMetricsWidget = ({
  dimension,
  instanceKey,
  specsOnly,
  view,
  context,
  showAll,
  latestWorkItemEvent,
  leadTimeTarget,
  cycleTimeTarget,
  leadTimeConfidenceTarget,
  cycleTimeConfidenceTarget,
  days,
  before,
  initialMetric,
  defectsOnly,
  pollInterval,
  hideControls,
  yAxisScale,
  setYAxisScale,
  includeSubTasks,
}) => {
  const {loading, error, data: projectDeliveryCycleData} = useQueryProjectClosedDeliveryCycleDetail({
    dimension,
    instanceKey,
    days,
    defectsOnly,
    specsOnly,
    before,
    includeSubTasks,
    referenceString: latestWorkItemEvent,
  });

  if (loading) return <Loading />;
  if (error) {
    logGraphQlError('DimensionDeliveryCycleFlowMetricsWidget.useQueryProjectClosedDeliveryCycleDetail', error);
    return null;
  }
  const targetMetrics = {leadTimeTarget, cycleTimeTarget, leadTimeConfidenceTarget, cycleTimeConfidenceTarget};

  return (
    <DimensionDeliveryCyclesFlowMetricsView
      instanceKey={instanceKey}
      context={context}
      days={days}
      data={projectDeliveryCycleData}
      dimension={dimension}
      targetMetrics={targetMetrics}
      defectsOnly={defectsOnly}
      specsOnly={specsOnly}
      initialMetric={initialMetric}
      yAxisScale={yAxisScale}
      setYAxisScale={setYAxisScale}
      hideControls={hideControls}
    />
  );
};

import React from "react";
import {Loading} from "../../../../../../components/graphql/loading";
import {pick} from "../../../../../../helpers/utility";
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
  stateMappingIndex,
  pollInterval,
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
  const flowMetricsData = projectDeliveryCycleData[dimension].workItemDeliveryCycles.edges.map((edge) =>
    pick(
      edge.node,
      "id",
      "name",
      "key",
      "displayId",
      "workItemKey",
      "workItemType",
      "state",
      "startDate",
      "endDate",
      "leadTime",
      "cycleTime",
      "latency",
      "duration",
      "effort",
      "authorCount"
    )
  );
  return (
    <DimensionDeliveryCyclesFlowMetricsView
      instanceKey={instanceKey}
      context={context}
      days={days}
      model={flowMetricsData}
      targetMetrics={targetMetrics}
      defectsOnly={defectsOnly}
      specsOnly={specsOnly}
      initialMetric={initialMetric}
      yAxisScale={yAxisScale}
      setYAxisScale={setYAxisScale}
    />
  );
};

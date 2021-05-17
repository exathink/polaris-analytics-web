import React from "react";
import {Loading} from "../../../../../components/graphql/loading";
import {pick} from "../../../../../helpers/utility";
import {ProjectDeliveryCyclesFlowMetricsView} from "./projectDeliveryCyclesFlowMetricsView";
import {useQueryProjectClosedDeliveryCycleDetail} from "../../hooks/useQueryProjectClosedDeliveryCycleDetail";
import {logGraphQlError} from "../../../../../components/graphql/utils";

export const ProjectDeliveryCycleFlowMetricsWidget = ({
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
  setYAxisScale
}) => {
  const {loading, error, data: projectDeliveryCycleData} = useQueryProjectClosedDeliveryCycleDetail({
    instanceKey,
    days,
    defectsOnly,
    specsOnly,
    before,
    referenceString: latestWorkItemEvent,
  });

  if (loading) return <Loading />;
  if (error) {
    logGraphQlError('ProjectDeliveryCycleFlowMetricsWidget.useQueryProjectClosedDeliveryCycleDetail', error);
    return null;
  }
  const targetMetrics = {leadTimeTarget, cycleTimeTarget, leadTimeConfidenceTarget, cycleTimeConfidenceTarget};
  const flowMetricsData = projectDeliveryCycleData.project.workItemDeliveryCycles.edges.map((edge) =>
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
    <ProjectDeliveryCyclesFlowMetricsView
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

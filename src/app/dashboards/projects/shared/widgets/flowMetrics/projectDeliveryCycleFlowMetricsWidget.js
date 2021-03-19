import React from "react";
import {Loading} from "../../../../../components/graphql/loading";
import {pick} from "../../../../../helpers/utility";
import {ProjectDeliveryCyclesFlowMetricsView} from "./projectDeliveryCyclesFlowMetricsView";
import {useQueryProjectClosedDeliveryCycleDetail} from "../../hooks/useQueryProjectClosedDeliveryCycleDetail";

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
  defectsOnly,
  stateMappingIndex,
  pollInterval,
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
  if (error) return null;
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
    />
  );
};

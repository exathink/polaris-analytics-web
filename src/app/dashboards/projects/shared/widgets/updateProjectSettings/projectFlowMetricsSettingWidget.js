import React from "react";
import {Loading} from "../../../../../components/graphql/loading";
import {pick} from "../../../../../helpers/utility";
import {ProjectFlowMetricsSettingView} from "./projectFlowMetricsSettingView";
import {useQueryProjectCycleMetrics} from "../../hooks/useQueryProjectCycleMetrics";
import {useQueryProjectClosedDeliveryCycleDetail} from "../../hooks/useQueryProjectClosedDeliveryCycleDetail";

export const ProjectFlowMetricsSettingWidget = ({
  instanceKey,
  specsOnly,
  view,
  context,
  latestWorkItemEvent,
  leadTimeTarget,
  cycleTimeTarget,
  leadTimeConfidenceTarget,
  cycleTimeConfidenceTarget,
  days,
  defectsOnly,
}) => {
  const {data: projectCycleMetricsData} = useQueryProjectCycleMetrics({
    instanceKey,
    days,
    targetPercentile: cycleTimeConfidenceTarget,
    referenceString: latestWorkItemEvent,
    defectsOnly,
    specsOnly,
  });

  const {loading, error, data: projectDeliveryCycleData} = useQueryProjectClosedDeliveryCycleDetail({
    instanceKey,
    days,
    defectsOnly,
    specsOnly,
    referenceString: latestWorkItemEvent,
  });

  if (loading) return <Loading />;
  if (error) return null;

  const targetMetrics = {leadTimeTarget, cycleTimeTarget, leadTimeConfidenceTarget, cycleTimeConfidenceTarget};
  const projectCycleMetrics = projectCycleMetricsData ? {...projectCycleMetricsData.project, ...targetMetrics} : {...targetMetrics};
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
    <ProjectFlowMetricsSettingView
      instanceKey={instanceKey}
      context={context}
      days={days}
      model={flowMetricsData}
      projectCycleMetrics={projectCycleMetrics}
      defectsOnly={defectsOnly}
      specsOnly={specsOnly}
    />
  );
};

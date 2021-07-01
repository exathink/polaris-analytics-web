import React from "react";
import {Loading} from "../../../../components/graphql/loading";
import {pick} from "../../../../helpers/utility";
import {ProjectResponseTimeSLASettingsView} from "./projectResponseTimeSLASettingsView";
import {useQueryProjectClosedDeliveryCycleDetail} from "../../shared/hooks/useQueryProjectClosedDeliveryCycleDetail";
import {logGraphQlError} from "../../../../components/graphql/utils";

export const ProjectResponseTimeSLASettingsWidget = ({
  dimension,
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
  const {loading, error, data: projectDeliveryCycleData} = useQueryProjectClosedDeliveryCycleDetail({
    dimension,
    instanceKey,
    days,
    defectsOnly,
    specsOnly,
    referenceString: latestWorkItemEvent,
  });

  if (loading) return <Loading />;
  if (error) {
    logGraphQlError("ProjectFlowMetricsSettingWidget.useQueryProjectClosedDeliveryCycleDetail", error);
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
    <ProjectResponseTimeSLASettingsView
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

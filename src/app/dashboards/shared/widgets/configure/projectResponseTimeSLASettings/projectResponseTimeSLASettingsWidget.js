import React from "react";
import {Loading} from "../../../../../components/graphql/loading";
import {ProjectResponseTimeSLASettingsView} from "./projectResponseTimeSLASettingsView";
import {useQueryProjectClosedDeliveryCycleDetail} from "../../../../projects/shared/hooks/useQueryProjectClosedDeliveryCycleDetail";
import {logGraphQlError} from "../../../../../components/graphql/utils";

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
  initialMetric,
  setSelectedMetric
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

  return (
    <ProjectResponseTimeSLASettingsView
      data={projectDeliveryCycleData}
      dimension={dimension}
      instanceKey={instanceKey}
      context={context}
      days={days}
      targetMetrics={targetMetrics}
      defectsOnly={defectsOnly}
      specsOnly={specsOnly}
      initialMetric={initialMetric}
      setSelectedMetric={setSelectedMetric}
    />
  );
};

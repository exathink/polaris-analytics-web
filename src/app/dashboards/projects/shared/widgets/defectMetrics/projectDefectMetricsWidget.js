import React from 'react';
import {Loading} from "../../../../../components/graphql/loading";

import {useQueryProjectDefectMetricsSummary} from "../../hooks/useQueryProjectDefectsSummary";
import {ProjectDefectMetricsSummaryView} from "./projectDefectMetricsSummaryView";
import {ProjectDefectMetricsDetailDashboard} from "./projectDefectMetricsDetailDashboard"

export const ProjectDefectMetricsWidget = (
  {
    instanceKey,
    days,
    targetPercentile,
    leadTimeTarget,
    cycleTimeTarget,
    leadTimeConfidenceTarget,
    cycleTimeConfidenceTarget,
    latestWorkItemEvent,
    stateMappingIndex,
    view,
    context,
    showAll,
    pollInterval
  }) => {
  const {loading, error, data: projectDefectMetrics} = useQueryProjectDefectMetricsSummary(
    {instanceKey, days, targetPercentile: cycleTimeConfidenceTarget || targetPercentile, ...{referenceString: latestWorkItemEvent}}
  );


  if (loading) return <Loading/>;
  if (error) return null;
  const {...defectMetrics} = projectDefectMetrics['project'];

  if (view === 'primary') {
    return (
      <ProjectDefectMetricsSummaryView
        instanceKey={instanceKey}
        showAll={showAll}
        stateMappingIndex={stateMappingIndex}
        {...defectMetrics}
      />
    )
  } else {
    return (
      <ProjectDefectMetricsDetailDashboard
        instanceKey={instanceKey}
        days={days}
        stateMappingIndex={stateMappingIndex}
        latestWorkItemEvent={latestWorkItemEvent}
        view={view}
        context={context}
        leadTimeTarget={leadTimeTarget}
        cycleTimeTarget={cycleTimeTarget}
        leadTimeConfidenceTarget={leadTimeConfidenceTarget}
        cycleTimeConfidenceTarget={cycleTimeConfidenceTarget}
      />
    )
  }
}






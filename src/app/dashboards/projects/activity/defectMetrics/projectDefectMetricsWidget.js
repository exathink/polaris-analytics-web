import React from 'react';
import {Loading} from "../../../../components/graphql/loading";

import {useQueryProjectDefectMetricsSummary} from "../hooks/useQueryProjectDefectsSummary";
import {ProjectDefectMetricsSummaryView} from "./projectDefectMetricsSummaryView";
import {ProjectDefectMetricsDetailDashboard} from "./projectDefectMetricsDetailDashboard"

export const ProjectDefectMetricsWidget = (
  {
    instanceKey,
    days,
    leadTimeTargetPercentile,
    cycleTimeTargetPercentile,
    latestWorkItemEvent,
    stateMappingIndex,
    view,
    context,
    showAll,
    pollInterval
  }) => {

  if (view === 'primary') {
    const {loading, error, data: projectDefectMetrics} = useQueryProjectDefectMetricsSummary(
      {instanceKey, days, targetPercentile: cycleTimeTargetPercentile, ...{referenceString: latestWorkItemEvent}}
    );


    if (loading) return <Loading/>;
    if (error) return null;
    const {...defectMetrics} = projectDefectMetrics['project'];
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
        leadTimeTargetPercentile={leadTimeTargetPercentile}
        cycleTimeTargetPercentile={cycleTimeTargetPercentile}
        stateMappingIndex={stateMappingIndex}
        latestWorkItemEvent={latestWorkItemEvent}
        view={view}
        context={context}
      />
    )
  }
}






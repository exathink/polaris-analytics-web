import React from "react";
import {Loading} from "../../../../components/graphql/loading";
import {ProjectAggregateFlowMetricsView} from "./projectAggregateFlowMetricsView";
import {ProjectFlowMetricsDetailDashboard} from "./projectFlowMetricsDetailDashboard";

import {useQueryProjectCycleMetrics} from "../hooks/useQueryProjectCycleMetrics";

export const ProjectFlowMetricsWidget = (
  {
    instanceKey,
    view,
    context,
    showAll,
    latestWorkItemEvent,
    days,
    targetPercentile,
    stateMappingIndex,
    pollInterval
  }) => {
  if (view === 'primary') {
    const {loading, error, data} = useQueryProjectCycleMetrics(
      {instanceKey, days, targetPercentile, referenceString: latestWorkItemEvent}
    );
    if (loading) return <Loading/>;
    if (error) return null;
    const {...cycleMetrics} = data['project'];
    return (
      <ProjectAggregateFlowMetricsView
        instanceKey={instanceKey}
        showAll={showAll}
        stateMappingIndex={stateMappingIndex}
        {...cycleMetrics}
      />
    )
  } else {
    return (
      <ProjectFlowMetricsDetailDashboard
        instanceKey={instanceKey}
        view={view}
        context={context}
        latestWorkItemEvent={latestWorkItemEvent}
        days={days}
        targetPercentile={targetPercentile}
        stateMappingIndex={stateMappingIndex}
      />
    )
  }
}

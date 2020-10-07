import React from "react";
import {Loading} from "../../../../components/graphql/loading";

import {useQueryProjectFlowMetricsTrends} from "../../shared/hooks/useQueryProjectFlowMetricsTrends"
import {ProjectResponseTimeTrendsView} from "./responseTimeTrendsView"
import {ProjectResponseTimeTrendsDetailDashboard} from "./responseTimeTrendsDetailDashboard";

export const ProjectResponseTimeTrendsWidget = (
  {
    instanceKey,
    view,
    context,
    showAll,
    latestWorkItemEvent,
    days,
    measurementWindow,
    samplingFrequency,
    targetPercentile,
    pollInterval
  }) => {
  const {loading, error, data} = useQueryProjectFlowMetricsTrends(
    {
      instanceKey: instanceKey,
      days: days,
      measurementWindow: measurementWindow,
      samplingFrequency: samplingFrequency,
      targetPercentile: targetPercentile,
      specsOnly: true,
      referenceString: latestWorkItemEvent,
    }
  );
  if (loading) return <Loading/>;
  if (error) return null;
  const {cycleMetricsTrends: flowMetricsTrends} = data['project'];
  return (
    view === 'primary' ?
      <ProjectResponseTimeTrendsView
        flowMetricsTrends={flowMetricsTrends}
        targetPercentile={targetPercentile}
        measurementWindow={measurementWindow}
        measurementPeriod={days}
        view={view}
      />
      :
      <ProjectResponseTimeTrendsDetailDashboard
        instanceKey={instanceKey}
        measurementWindow={measurementWindow}
        days={days}
        samplingFrequency={samplingFrequency}
        targetPercentile={targetPercentile}
        context={context}
        view={view}
        latestWorkItemEvent={latestWorkItemEvent}
      />
  )
}

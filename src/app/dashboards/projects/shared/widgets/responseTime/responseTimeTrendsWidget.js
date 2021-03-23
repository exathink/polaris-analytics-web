import React from "react";
import {Loading} from "../../../../../components/graphql/loading";

import {useQueryProjectFlowMetricsTrends} from "../../hooks/useQueryProjectFlowMetricsTrends"
import {ProjectResponseTimeTrendsView} from "./responseTimeTrendsView"
import {ProjectResponseTimeTrendsDetailDashboard} from "./responseTimeTrendsDetailDashboard";
import {getServerDate} from "../../../../../helpers/utility";

export const ProjectResponseTimeTrendsWidget = React.memo((
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
    leadTimeTarget,
    cycleTimeTarget,
    cycleTimeConfidenceTarget,
    leadTimeConfidenceTarget,
    setBefore,
    defaultSeries,
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
        leadTimeTarget={leadTimeTarget}
        cycleTimeTarget={cycleTimeTarget}
        measurementWindow={measurementWindow}
        measurementPeriod={days}
        onSelectionChange={(workItems) => {
          if (workItems.length === 1) {
            const [{measurementDate}] = workItems;
            setBefore(getServerDate(measurementDate));
          }
        }}
        view={view}
        defaultSeries={defaultSeries}
      />
      :
      <ProjectResponseTimeTrendsDetailDashboard
        instanceKey={instanceKey}
        measurementWindow={measurementWindow}
        days={days}
        samplingFrequency={samplingFrequency}
        targetPercentile={targetPercentile}
        leadTimeTarget={leadTimeTarget}
        cycleTimeTarget={cycleTimeTarget}
        context={context}
        view={view}
        latestWorkItemEvent={latestWorkItemEvent}
        leadTimeConfidenceTarget={leadTimeConfidenceTarget}
        cycleTimeConfidenceTarget={cycleTimeConfidenceTarget}
        defaultSeries={defaultSeries}
      />
  )
});

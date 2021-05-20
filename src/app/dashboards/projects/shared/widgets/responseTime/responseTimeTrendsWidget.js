import React from "react";
import {Loading} from "../../../../../components/graphql/loading";

import {useQueryProjectFlowMetricsTrends} from "../../hooks/useQueryProjectFlowMetricsTrends"
import {ProjectResponseTimeTrendsView} from "./responseTimeTrendsView"
import {ProjectResponseTimeTrendsDetailDashboard} from "./responseTimeTrendsDetailDashboard";
import {getServerDate} from "../../../../../helpers/utility";
import {logGraphQlError} from "../../../../../components/graphql/utils";

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
    setSeriesName,
    defaultSeries,
    pollInterval,
    includeSubTasks
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
      includeSubTasks: includeSubTasks
    }
  );
  if (loading) return <Loading/>;
  if (error) {
    logGraphQlError('ProjectResponseTimeTrendsWidget.useQueryProjectFlowMetricsTrends', error);
    return null;
  }
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
            const [{measurementDate, key}] = workItems;
            if (setBefore && setSeriesName) {
              setBefore(getServerDate(measurementDate));
              setSeriesName(key);
            }
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
        includeSubTasks={includeSubTasks}
      />
  )
});

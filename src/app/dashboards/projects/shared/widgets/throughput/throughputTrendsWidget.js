import React from "react";
import {Loading} from "../../../../../components/graphql/loading";

import {useQueryProjectFlowMetricsTrends} from "../../hooks/useQueryProjectFlowMetricsTrends"
import {ProjectVolumeTrendsView} from "./throughputTrendsView"
import {ProjectVolumeTrendsDetailDashboard} from "./throughputTrendsDetailDashboard";
import {getServerDate} from "../../../../../helpers/utility";
import {logGraphQlError} from "../../../../../components/graphql/utils";

export const ProjectVolumeTrendsWidget = React.memo((
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
    leadTimeConfidenceTarget,
    cycleTimeConfidenceTarget,
    setBefore,
    setSeriesName,
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
        includeSubTasks: includeSubTasks
      }
    );
    if (loading) return <Loading/>;
    if (error) {
      logGraphQlError('ProjectPredictabilityTrendsWidget.useQueryProjectFlowMetricsTrends', error);
      return null;
    }
    const {cycleMetricsTrends: flowMetricsTrends} = data['project'];
    return (
      view === 'primary' ?
        <ProjectVolumeTrendsView
          flowMetricsTrends={flowMetricsTrends}
          targetPercentile={targetPercentile}
          measurementWindow={measurementWindow}
          measurementPeriod={days}
          view={view}
          onSelectionChange={(workItems) => {
            if (workItems.length === 1) {
              const [{measurementDate, key}] = workItems;
              if (setBefore && setSeriesName) {
                setBefore(getServerDate(measurementDate));
                setSeriesName(key);
              }
            }
          }}
        />
        :
        <ProjectVolumeTrendsDetailDashboard
          instanceKey={instanceKey}
          flowMetricsTrends={flowMetricsTrends}
          targetPercentile={targetPercentile}
          measurementWindow={measurementWindow}
          days={days}
          samplingFrequency={samplingFrequency}
          leadTimeTarget={leadTimeTarget}
          cycleTimeTarget={cycleTimeTarget}
          leadTimeConfidenceTarget={leadTimeConfidenceTarget}
          cycleTimeConfidenceTarget={cycleTimeConfidenceTarget}
          view={view}
          context={context}
        />
    )
});

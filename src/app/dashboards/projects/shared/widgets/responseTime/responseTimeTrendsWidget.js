import React from "react";
import {Loading} from "../../../../../components/graphql/loading";

import {useQueryDimensionFlowMetricsTrends} from "../../hooks/useQueryDimensionFlowMetricsTrends"
import {ProjectResponseTimeTrendsView} from "./responseTimeTrendsView"
import {ProjectResponseTimeTrendsDetailDashboard} from "./responseTimeTrendsDetailDashboard";
import {getServerDate} from "../../../../../helpers/utility";
import {logGraphQlError} from "../../../../../components/graphql/utils";

export const DimensionResponseTimeTrendsWidget = React.memo((
  {
    dimension,
    instanceKey,
    view,
    context,
    showAll,
    latestWorkItemEvent,
    days,
    specsOnly,
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

  const {loading, error, data} = useQueryDimensionFlowMetricsTrends(
    {
      dimension,
      instanceKey,
      days,
      measurementWindow,
      samplingFrequency,
      targetPercentile,
      specsOnly: specsOnly != null ? specsOnly : true,
      referenceString: latestWorkItemEvent,
      includeSubTasks
    }
  );
  if (loading) return <Loading/>;
  if (error) {
    logGraphQlError('DimensionResponseTimeTrendsWidget.useQueryDimensionFlowMetricsTrends', error);
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
        specsOnly={specsOnly}
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

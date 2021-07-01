import React from "react";
import {Loading} from "../../../../../../components/graphql/loading";

import {useQueryDimensionFlowMetricsTrends} from "../../hooks/useQueryDimensionFlowMetricsTrends"
import {ResponseTimeTrendsView} from "./responseTimeTrendsView"
import {ResponseTimeTrendsDetailDashboard} from "./responseTimeTrendsDetailDashboard";
import {getServerDate} from "../../../../../../helpers/utility";
import {logGraphQlError} from "../../../../../../components/graphql/utils";

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
  const {cycleMetricsTrends: flowMetricsTrends} = data[dimension];
  return (
    view === 'primary' ?
      <ResponseTimeTrendsView
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
      <ResponseTimeTrendsDetailDashboard
        dimension={dimension}
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

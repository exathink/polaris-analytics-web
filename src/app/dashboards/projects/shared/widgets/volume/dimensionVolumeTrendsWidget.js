import React from "react";
import {Loading} from "../../../../../components/graphql/loading";

import {useQueryDimensionFlowMetricsTrends} from "../../hooks/useQueryDimensionFlowMetricsTrends"
import {VolumeTrendsView} from "./volumeTrendsView"
import {VolumeTrendsDetailDashboard} from "./volumeTrendsDetailDashboard";
import {getServerDate} from "../../../../../helpers/utility";
import {logGraphQlError} from "../../../../../components/graphql/utils";


export const DimensionVolumeTrendsWidget = React.memo((
  {
    dimension,
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
    const {loading, error, data} = useQueryDimensionFlowMetricsTrends(
      {
        dimension,
        instanceKey,
        days,
        measurementWindow,
        samplingFrequency,
        targetPercentile,
        includeSubTasks
      }
    );
    if (loading) return <Loading/>;
    if (error) {
      logGraphQlError('DimensionPredictabilityTrendsWidget.useQueryDimensionFlowMetricsTrends', error);
      return null;
    }
    const {cycleMetricsTrends: flowMetricsTrends} = data['project'];
    return (
      view === 'primary' ?
        <VolumeTrendsView
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
        <VolumeTrendsDetailDashboard
          dimension={dimension}
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
          includeSubTasks={includeSubTasks}
        />
    )
});

import React from "react";
import {Loading} from "../../../../../components/graphql/loading";
import {logGraphQlError} from "../../../../../components/graphql/utils";
import {getServerDate} from "../../../../../helpers/utility";

import {useQueryDimensionFlowMetricsTrends} from "../../hooks/useQueryDimensionFlowMetricsTrends"
import {PredictabilityTrendsView} from "./predictabilityTrendsView"

export const DimensionPredictabilityTrendsWidget = React.memo((
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
    cycleTimeTarget,
    leadTimeTarget,
    cycleTimeConfidenceTarget,
    leadTimeConfidenceTarget,
    targetPercentile,
    specsOnly,
    setBefore,
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
        includeSubTasks: includeSubTasks
      }
    );
    if (loading) return <Loading/>;
    if (error) {
      logGraphQlError('DimensionPredictabilityTrendsWidget.useQueryDimensionFlowMetricsTrends', error);
      return null;
    }
    const {cycleMetricsTrends: flowMetricsTrends} = data['project'];
    return (
      <PredictabilityTrendsView
        dimension={dimension}
        instanceKey={instanceKey}
        flowMetricsTrends={flowMetricsTrends}
        targetPercentile={targetPercentile}
        measurementWindow={measurementWindow}
        measurementPeriod={days}
        cycleTimeTarget={cycleTimeTarget}
        leadTimeTarget={leadTimeTarget}
        cycleTimeConfidenceTarget={cycleTimeConfidenceTarget}
        leadTimeConfidenceTarget={leadTimeConfidenceTarget}
        samplingFrequency={samplingFrequency}
        view={view}
        specsOnly={specsOnly}
        context={context}
        latestWorkItemEvent={latestWorkItemEvent}
        includeSubTasks={includeSubTasks}
        onSelectionChange={(workItems) => {
          if (workItems.length === 1) {
            const [{measurementDate}] = workItems;
            if (setBefore) {
              setBefore(getServerDate(measurementDate));
            }
          }
        }}
      />
    )
});

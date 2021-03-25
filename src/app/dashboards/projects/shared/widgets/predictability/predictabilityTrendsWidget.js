import React from "react";
import {Loading} from "../../../../../components/graphql/loading";
import {getServerDate} from "../../../../../helpers/utility";

import {useQueryProjectFlowMetricsTrends} from "../../hooks/useQueryProjectFlowMetricsTrends"
import {ProjectPredictabilityTrendsView} from "./predictabilityTrendsView"

export const ProjectPredictabilityTrendsWidget = React.memo((
  {
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
    setBefore,
    pollInterval
  }) => {
    const {loading, error, data} = useQueryProjectFlowMetricsTrends(
      {
        instanceKey: instanceKey,
        days: days,
        measurementWindow: measurementWindow,
        specsOnly: true,
        samplingFrequency: samplingFrequency,
        targetPercentile: targetPercentile,
        referenceString: latestWorkItemEvent,

      }
    );
    if (loading) return <Loading/>;
    if (error) return null;
    const {cycleMetricsTrends: flowMetricsTrends} = data['project'];
    return (
      <ProjectPredictabilityTrendsView
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
        context={context}
        latestWorkItemEvent={latestWorkItemEvent}
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

import React, {useState} from "react";
import {Loading} from "../../../../components/graphql/loading";

import {useQueryProjectTraceabilityTrends} from "./useQueryProjectTraceabilityTrends";
import {ProjectTraceabilityTrendsView} from "./traceabilityTrendsView"

export const ProjectTraceabilityTrendsWidget = (
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
    const [excludeMerges, setExcludeMerges] = useState(true);
    const {loading, error, data} = useQueryProjectTraceabilityTrends(
      {
        instanceKey: instanceKey,
        days: days,
        measurementWindow: measurementWindow,
        samplingFrequency: samplingFrequency,
        excludeMerges: excludeMerges
      }
    );
    if (loading) return <Loading/>;
    if (error) return null;
    const {traceabilityTrends} = data['project'];
    return (
      <ProjectTraceabilityTrendsView
        traceabilityTrends={traceabilityTrends}
        measurementWindow={measurementWindow}
        measurementPeriod={days}
        excludeMerges={excludeMerges}
        setExcludeMerges={setExcludeMerges}
        view={view}
      />
    )
}

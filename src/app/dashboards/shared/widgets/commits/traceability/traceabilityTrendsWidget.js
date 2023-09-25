import React from "react";
import {Loading} from "../../../../../components/graphql/loading";

import {useQueryProjectTraceabilityTrends} from "./useQueryProjectTraceabilityTrends";
import {ProjectTraceabilityTrendsView} from "./traceabilityTrendsView"
import {ProjectTraceabilityTrendsDetailDashboard} from "./traceabilityTrendsDetailDashboard";

export const ProjectTraceabilityTrendsWidget = (
  {
    instanceKey,
    view,
    context,
    showAll,
    latestWorkItemEvent,
    latestCommit,
    excludeMerges,
    days,
    measurementWindow,
    samplingFrequency,
    targetPercentile,
    target,
    asStatistic,
    primaryStatOnly,
    pollInterval,
    displayBag
  }) => {
    const excludeMergesDefault = excludeMerges != null ? excludeMerges : true;
    const {loading, error, data} = useQueryProjectTraceabilityTrends(
      {
        instanceKey: instanceKey,
        days: days,
        measurementWindow: measurementWindow,
        samplingFrequency: samplingFrequency,
        excludeMerges: excludeMergesDefault
      }
    );
    if (loading) return <Loading/>;
    if (error) return null;
    const {traceabilityTrends} = data['project'];
    return (
      view !== 'detail' ?
        <ProjectTraceabilityTrendsView
          traceabilityTrends={traceabilityTrends}
          measurementWindow={measurementWindow}
          measurementPeriod={days}
          excludeMerges={excludeMergesDefault}
          asStatistic={asStatistic}
          primaryStatOnly={primaryStatOnly}
          target={target}
          displayBag={displayBag}
        />
        :
        <ProjectTraceabilityTrendsDetailDashboard
          instanceKey={instanceKey}
          context={context}
          view={view}
          latestCommit={latestCommit}
          latestWorkItemEvent={latestWorkItemEvent}
          days={days}
          measurementWindow={measurementWindow}
          samplingFrequency={samplingFrequency}

        />
    )
}

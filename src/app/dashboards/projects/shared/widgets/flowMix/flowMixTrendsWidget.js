import React from "react";
import {Loading} from "../../../../../components/graphql/loading";

import {useQueryProjectFlowMixTrends} from "./useQueryProjectFlowMixTrends";
import {ProjectFlowMixTrendsView} from "./flowMixTrendsView";
import {ProjectFlowMixTrendsDetailDashboard} from "./flowMixTrendsDetailDashboard";

export const ProjectFlowMixTrendsWidget = (
  {
    instanceKey,
    view,
    context,
    showAll,
    latestWorkItemEvent,
    latestCommit,
    specsOnly,
    days,
    measurementWindow,
    samplingFrequency,
    targetPercentile,
    target,
    asStatistic,
    showCounts,
    chartOptions,
    pollInterval
  }) => {

    const {loading, error, data} = useQueryProjectFlowMixTrends(
      {
        instanceKey: instanceKey,
        days: days,
        measurementWindow: measurementWindow,
        samplingFrequency: samplingFrequency,
        specsOnly: specsOnly != null? specsOnly : false
      }
    );
    if (loading) return <Loading/>;
    if (error) return null;
    const {flowMixTrends} = data['project'];
    return (
      view !== 'detail' ?
        <ProjectFlowMixTrendsView
          flowMixTrends={flowMixTrends}
          measurementWindow={measurementWindow}
          measurementPeriod={days}
          asStatistic={asStatistic}
          target={target}
          specsOnly={specsOnly}
          view={view}
          chartOptions={chartOptions}
          showCounts={showCounts}
        />
        :
        <ProjectFlowMixTrendsDetailDashboard
          instanceKey={instanceKey}
          measurementWindow={measurementWindow}
          days={days}
          samplingFrequency={samplingFrequency}
          view={view}
          latestCommit={latestCommit}
          latestWorkItemEvent={latestWorkItemEvent}
          specsOnly={specsOnly}
          chartOptions={chartOptions}
          />

    )
}

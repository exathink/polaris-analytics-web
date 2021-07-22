import React from "react";
import {Loading} from "../../../../../../components/graphql/loading";

import {useQueryDimensionFlowMixTrends} from "./useQueryDimensionFlowMixTrends";
import {ProjectFlowMixTrendsView} from "./flowMixTrendsView";
import {DimensionFlowMixTrendsDetailDashboard} from "./flowMixTrendsDetailDashboard";

export const DimensionFlowMixTrendsWidget = (
  {
    dimension,
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
    pollInterval,
    includeSubTasks,
  }) => {

    const {loading, error, data} = useQueryDimensionFlowMixTrends(
      {
        dimension,
        instanceKey,
        days,
        measurementWindow,
        samplingFrequency,
        specsOnly: specsOnly != null? specsOnly : false,
        includeSubTasks: includeSubTasks
      }
    );
    if (loading) return <Loading/>;
    if (error) return null;
    const {flowMixTrends} = data[dimension];
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
        <DimensionFlowMixTrendsDetailDashboard
          dimension={dimension}
          instanceKey={instanceKey}
          measurementWindow={measurementWindow}
          days={days}
          samplingFrequency={samplingFrequency}
          view={view}
          latestCommit={latestCommit}
          latestWorkItemEvent={latestWorkItemEvent}
          specsOnly={specsOnly}
          chartOptions={chartOptions}
          includeSubTasks={includeSubTasks}
          />

    )
}

import React from "react";
import {Loading} from "../../../../components/graphql/loading";

import {useQueryProjectFlowMixTrends} from "./useQueryProjectFlowMixTrends";
import {ProjectFlowMixTrendsView} from "./flowMixTrendsView";

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
        <ProjectFlowMixTrendsView
          flowMixTrends={flowMixTrends}
          measurementWindow={measurementWindow}
          measurementPeriod={days}
          asStatistic={asStatistic}
          target={target}
          specsOnly={specsOnly}
        />
    )
}

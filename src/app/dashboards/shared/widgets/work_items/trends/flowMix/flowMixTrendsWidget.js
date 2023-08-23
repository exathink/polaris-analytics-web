import React from "react";
import {Loading} from "../../../../../../components/graphql/loading";

import {useQueryDimensionFlowMixTrends} from "./useQueryDimensionFlowMixTrends";
import {ProjectFlowMixTrendsView} from "./flowMixTrendsView";
import {DimensionFlowMixTrendsDetailDashboard} from "./flowMixTrendsDetailDashboard";
import { getServerDate } from "../../../../../../helpers/utility";

export const DimensionFlowMixTrendsWidget = (
  {
    dimension,
    tags,
    release,
    instanceKey,
    title,
    subTitle,
    view,
    context,
    showAll,
    latestWorkItemEvent,
    latestCommit,
    workItemScope,
    setWorkItemScope,
    specsOnly,
    days,
    measurementWindow,
    samplingFrequency,
    targetPercentile,
    target,
    asStatistic,
    asCard,
    showCounts,
    chartOptions,
    pollInterval,
    includeSubTasks,
    setBefore,
    setFilter
  }) => {

    const {loading, error, data} = useQueryDimensionFlowMixTrends(
      {
        dimension,
        tags,
        release,
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

    return (
      view !== 'detail' ?
        <ProjectFlowMixTrendsView
          data={data}
          dimension={dimension}
          measurementWindow={measurementWindow}
          measurementPeriod={days}
          asStatistic={asStatistic}
          asCard={asCard}
          target={target}
          specsOnly={specsOnly}
          view={view}
          chartOptions={chartOptions}
          showCounts={showCounts}
          title={title}
          subTitle={subTitle}
          onPointClick={({item, measurementDate}) => {
            setBefore?.(getServerDate(measurementDate));
            setFilter?.(item.category)
        }}
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
          workItemScope={workItemScope}
          setWorkItemScope={setWorkItemScope}
          chartOptions={chartOptions}
          includeSubTasks={includeSubTasks}
          />

    )
}

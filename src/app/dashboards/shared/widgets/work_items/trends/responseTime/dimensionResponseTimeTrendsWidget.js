import React from "react";
import {Loading} from "../../../../../../components/graphql/loading";

import {useQueryDimensionFlowMetricsTrends} from "../../hooks/useQueryDimensionFlowMetricsTrends"
import {ResponseTimeTrendsView} from "./responseTimeTrendsView"
import {ResponseTimeTrendsDetailDashboard} from "./responseTimeTrendsDetailDashboard";
import { getReferenceString, getServerDate } from "../../../../../../helpers/utility";
import {logGraphQlError} from "../../../../../../components/graphql/utils";

export const DimensionResponseTimeTrendsWidget = React.memo((
  {
    dimension,
    tags,
    release,
    instanceKey,
    title,
    view,
    context,
    showAll,
    latestCommit,
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
    includeSubTasks,
    showAnnotations,
  }) => {

  const {loading, error, data} = useQueryDimensionFlowMetricsTrends(
    {
      dimension,
      tags,
      release,
      instanceKey,
      days,
      measurementWindow,
      samplingFrequency,
      targetPercentile,
      specsOnly: specsOnly != null ? specsOnly : true,
      referenceString: getReferenceString(latestWorkItemEvent, latestCommit),
      includeSubTasks
    }
  );
  if (loading) return <Loading/>;
  if (error) {
    logGraphQlError('DimensionResponseTimeTrendsWidget.useQueryDimensionFlowMetricsTrends', error);
    return null;
  }
  
  return (
    view === 'primary' ?
      <ResponseTimeTrendsView
        title={title}
        data={data}
        dimension={dimension}
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
        showAnnotations={showAnnotations}
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

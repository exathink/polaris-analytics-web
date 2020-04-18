import React from 'react';
import {Loading} from "../../../../components/graphql/loading";

import {useQueryProjectDefectMetricsSummary} from "../hooks/useQueryProjectDefectsSummary";
import {ProjectDefectMetricsSummaryView} from "./projectDefectMetricsSummaryView";


export const ProjectDefectMetricsWidget = (
  {
    instanceKey,
    days,
    targetPercentile,
    latestWorkItemEvent,
    stateMappingIndex,
    showAll,
    pollInterval
  }) => {

  const {loading, error, data: projectDefectMetrics} = useQueryProjectDefectMetricsSummary(
    {instanceKey, days, targetPercentile, ...{referenceString: latestWorkItemEvent}}
  );


  if (loading) return <Loading/>;
  if (error) return null;
  const {...defectMetrics} = projectDefectMetrics['project'];
  return (
    <ProjectDefectMetricsSummaryView
      instanceKey={instanceKey}
      showAll={showAll}
      stateMappingIndex={stateMappingIndex}
      {...defectMetrics}
    />
  )
}






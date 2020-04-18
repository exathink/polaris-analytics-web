import React from "react";
import {Loading} from "../../../../components/graphql/loading";
import {pick} from "../../../../helpers/utility";
import {ProjectDeliveryCyclesFlowMetricsView} from "./projectDeliveryCyclesFlowMetricsView";
import {useQueryProjectCycleMetrics} from "../hooks/useQueryProjectCycleMetrics";
import {useQueryProjectClosedDeliveryCycleDetail} from "../hooks/useQueryProjectClosedDeliveryCycleDetail";

export const ProjectDeliveryCycleFlowMetricsWidget = (
  {
    instanceKey,
    view,
    showAll,
    latestWorkItemEvent,
    targetPercentile,
    days,
    stateMappingIndex,
    pollInterval
  }) => {

  const {data: projectCycleMetricsData} = useQueryProjectCycleMetrics(
    {instanceKey, days, targetPercentile, referenceString: latestWorkItemEvent}
  )

  const { loading, error, data: projectDeliveryCycleData } = useQueryProjectClosedDeliveryCycleDetail(
    {instanceKey, days, referenceString: latestWorkItemEvent}
  );

  if (loading) return <Loading/>;
  if (error) return null;
  const projectCycleMetrics = projectCycleMetricsData ? projectCycleMetricsData.project : {};
  const flowMetricsData = projectDeliveryCycleData.project.workItemDeliveryCycles.edges.map(
    edge => pick(
      edge.node,
      'id',
      'name',
      'key',
      'displayId',
      'workItemType',
      'startDate',
      'endDate',
      'leadTime',
      'cycleTime'
    )
  );
  return (
    <ProjectDeliveryCyclesFlowMetricsView
      instanceKey={instanceKey}
      days={days}
      model={flowMetricsData}
      projectCycleMetrics={projectCycleMetrics}
    />
  );
}


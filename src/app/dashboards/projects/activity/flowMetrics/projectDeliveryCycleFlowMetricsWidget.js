import React from "react";
import {analytics_service} from "../../../../services/graphql";
import {PROJECT_CLOSED_DELIVERY_CYCLES_DETAIL} from "../queries";
import {Loading} from "../../../../components/graphql/loading";
import {pick} from "../../../../helpers/utility";
import {ProjectDeliveryCyclesFlowMetricsView} from "./projectDeliveryCyclesFlowMetricsView";
import {useQuery} from '@apollo/react-hooks';
import {useQueryProjectCycleMetrics} from "../hooks/useQueryProjectCycleMetrics";

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

  const { loading, error, data: projectDeliveryCycleData } = useQuery(
    PROJECT_CLOSED_DELIVERY_CYCLES_DETAIL, {
      client: analytics_service,
      variables: {
        key: instanceKey,
        referenceString: latestWorkItemEvent,
        days: days
      },
      errorPolicy: 'all',
      pollInterval: pollInterval || analytics_service.defaultPollInterval()
    });

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


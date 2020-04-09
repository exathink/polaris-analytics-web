import React from "react";
import {analytics_service} from "../../../../services/graphql";
import {PROJECT_CLOSED_DELIVERY_CYCLES_DETAIL, PROJECT_CYCLE_METRICS} from "../queries";
import {Loading} from "../../../../components/graphql/loading";
import {pick} from "../../../../helpers/utility";
import {ProjectDeliveryCyclesFlowMetricsView} from "./projectDeliveryCyclesFlowMetricsView";
import {Query} from "react-apollo";
import {useFetchProjectAggregateCycleMetrics} from "../hooks/useProjectAggregateCycleMetrics";

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
  const projectCycleMetrics = useFetchProjectAggregateCycleMetrics(instanceKey, days, targetPercentile, latestWorkItemEvent);
  return (
    <Query
      client={analytics_service}
      query={PROJECT_CLOSED_DELIVERY_CYCLES_DETAIL}
      variables={{
        key: instanceKey,
        referenceString: latestWorkItemEvent,
        days: days
      }}
      errorPolicy={'all'}
      pollInterval={pollInterval || analytics_service.defaultPollInterval()}
    >
      {
        ({loading, error, data}) => {
          if (loading) return <Loading/>;
          if (error) return null;
          const flowMetricsData  = data.project.workItemDeliveryCycles.edges.map(
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
          )

        }
      }
    </Query>

)}

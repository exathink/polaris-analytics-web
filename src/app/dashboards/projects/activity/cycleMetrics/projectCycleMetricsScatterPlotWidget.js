import React from "react";
import {analytics_service} from "../../../../services/graphql";
import {PROJECT_CLOSED_DELIVERY_CYCLES_DETAIL} from "../queries";
import {Loading} from "../../../../components/graphql/loading";
import {pick} from "../../../../helpers/utility";
import {CycleMetricsScatterPlotChart} from "./cycleMetricsScatterPlotChart";
import {Query} from "react-apollo";

export const ProjectCycleMetricsScatterPlotWidget = (
  {
    instanceKey,
    view,
    showAll,
    latestWorkItemEvent,
    days,
    stateMappingIndex,
    pollInterval
  }) => (
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
          const scatterPlotData  = data.project.workItemDeliveryCycles.edges.map(
            edge => pick(
              edge.node,
              'id',
              'name',
              'key',
              'startDate',
              'endDate',
              'leadTime',
              'cycleTime'
            )
          );
          return (
            <CycleMetricsScatterPlotChart model={scatterPlotData}/>
          )

        }
      }
    </Query>

)

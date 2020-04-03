import React from "react";
import {analytics_service} from "../../../../services/graphql";
import {PROJECT_CYCLE_METRICS} from "../queries";
import {Loading} from "../../../../components/graphql/loading";
import {ProjectAggregateCycleMetricsPanel} from "./projectAggregateCycleMetricsPanel";
import {ProjectCycleMetricsDetailView} from "./projectCycleMetricsDetailView";

import {Query} from "react-apollo";

export const ProjectCycleMetricsWidget = (
  {
    instanceKey,
    view,
    showAll,
    latestWorkItemEvent,
    days,
    targetPercentile,
    stateMappingIndex,
    pollInterval
  }) => (
  view === 'primary' ?
    <Query
      client={analytics_service}
      query={PROJECT_CYCLE_METRICS}
      variables={{
        key: instanceKey,
        referenceString: latestWorkItemEvent,
        days: days,
        targetPercentile: targetPercentile
      }}
      errorPolicy={'all'}
      pollInterval={pollInterval || analytics_service.defaultPollInterval()}
    >
      {
        ({loading, error, data}) => {
          if (loading) return <Loading/>;
          if (error) return null;
          const {...cycleMetrics} = data['project'];
          return (
            <ProjectAggregateCycleMetricsPanel
              instanceKey={instanceKey}
              showAll={showAll}
              stateMappingIndex={stateMappingIndex}
              {...cycleMetrics}
            />
          )

        }
      }
    </Query>
    :
    <ProjectCycleMetricsDetailView
      instanceKey={instanceKey}
      view={view}
      latestWorkItemEvent={latestWorkItemEvent}
      days={days}
      targetPercentile={targetPercentile}
      stateMappingIndex={stateMappingIndex}
    />
)

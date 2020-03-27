import React from "react";
import {analytics_service} from "../../../../services/graphql";
import {PROJECT_CYCLE_METRICS} from "../queries";
import {Loading} from "../../../../components/graphql/loading";
import {ProjectCycleMetricsView} from "./projectCycleMetricsView";
import {Query} from "react-apollo";

export const ProjectCycleMetricsWidget = (
  {
    instanceKey,
    latestWorkItemEvent,
    days,
    targetPercentile,
    stateMappingIndex,
    pollInterval
  }) => (
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
          <ProjectCycleMetricsView
            instanceKey={instanceKey}
            stateMappingIndex={stateMappingIndex}
            {...cycleMetrics}
          />
        )

      }
    }
  </Query>
)

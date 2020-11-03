import React from 'react';
import {Loading} from "../../../../../components/graphql/loading";
import {ProjectResponseTimeSLAView} from "./projectResponseTimeSLAView";

import {useQueryProjectResponseTimeSLA} from "./useQueryProjectResponseTimeSLA";

export const ProjectResponseTimeSLAWidget = (
  {
    instanceKey,
    days,
    leadTimeTarget,
    cycleTimeTarget,
    leadTimeConfidenceTarget,
    cycleTimeConfidenceTarget,
    responseTimeTarget,
    latestWorkItemEvent,
    metric,
    specsOnly,
    pollInterval
  }) => {

  const {loading, error, data} = useQueryProjectResponseTimeSLA({
    instanceKey, leadTimeTarget, cycleTimeTarget, leadTimeConfidenceTarget, cycleTimeConfidenceTarget, specsOnly,
    days, referenceString: latestWorkItemEvent
  })

  if (loading) return <Loading/>;
  if (error) return null;
  const {responseTimeConfidenceTrends, cycleMetricsTrends} = data['project'];
  return (
    <ProjectResponseTimeSLAView
      metric={metric}
      responseTimeConfidenceTrends={responseTimeConfidenceTrends}
      cycleMetricsTrends={cycleMetricsTrends}
      leadTimeTarget={leadTimeTarget}
      cycleTimeTarget={cycleTimeTarget}
      leadTimeConfidenceTarget={leadTimeConfidenceTarget}
      cycleTimeConfidenceTarget={cycleTimeConfidenceTarget}
    />
  )
}






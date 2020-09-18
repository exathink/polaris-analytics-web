import React from 'react';
import {Loading} from "../../../../components/graphql/loading";
import {ProjectPredictabilityView} from "./projectPredictabilityView";

import {useQueryProjectPredictability} from "./useQueryProjectPredictability";

export const ProjectPredictabilityWidget = (
  {
    instanceKey,
    days,
    leadTimeTarget,
    cycleTimeTarget,
    leadTimeConfidenceTarget,
    cycleTimeConfidenceTarget,
    responseTimeTarget,
    latestWorkItemEvent,
    specsOnly,
    pollInterval
  }) => {

  const {loading, error, data} = useQueryProjectPredictability({
    instanceKey, leadTimeTarget, cycleTimeTarget, leadTimeConfidenceTarget, cycleTimeConfidenceTarget, specsOnly,
    days, referenceString: latestWorkItemEvent
  })

  if (loading) return <Loading/>;
  if (error) return null;
  const {responseTimeConfidenceTrends, cycleMetricsTrends} = data['project'];
  return (
    <ProjectPredictabilityView
      responseTimeConfidenceTrends={responseTimeConfidenceTrends}
      cycleMetricsTrends={cycleMetricsTrends}
      leadTimeTarget={leadTimeTarget}
      cycleTimeTarget={cycleTimeTarget}
      leadTimeConfidenceTarget={leadTimeConfidenceTarget}
      cycleTimeConfidenceTarget={cycleTimeConfidenceTarget}
    />
  )
}






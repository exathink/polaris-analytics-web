import React from 'react';
import {Loading} from "../../../../components/graphql/loading";
import {ProjectPredictabilityView} from "./projectPredictabilityView";

import {useQueryProjectResponseTimeConfidenceTrends} from "../hooks/useQueryProjectResponseTimeConfidence";

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

  const {loading, error, data} = useQueryProjectResponseTimeConfidenceTrends({
    instanceKey, leadTimeTarget, cycleTimeTarget, specsOnly,
    days: 7, measurementWindow: days, samplingFrequency: 7, referenceString: latestWorkItemEvent
  })

  if (loading) return <Loading/>;
  if (error) return null;
  const {responseTimeConfidenceTrends} = data['project'];
  return (
    <ProjectPredictabilityView
      responseTimeConfidenceTrends={responseTimeConfidenceTrends}
      leadTimeConfidenceTarget={leadTimeConfidenceTarget}
      cycleTimeConfidenceTarget={cycleTimeConfidenceTarget}
    />
  )
}






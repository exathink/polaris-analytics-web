import React, { useState } from 'react';
import {Loading} from "../../../../components/graphql/loading";
import {useQueryProjectPipelineSummary} from "../hooks/useQueryProjectPipelineSummary";
import {ProjectPipelineFunnelView} from "./projectPipelineFunnelView";
import {getLatest} from "../../../../helpers/utility";

export const ProjectPipelineFunnelWidget = (
  {
    instanceKey,
    latestWorkItemEvent,
    latestCommit,
    days,
    view,
    context,
    pollInterval
  }) => {

  const [selectedGrouping, setSelectedGrouping] = useState('all');

  const {loading, error, data} = useQueryProjectPipelineSummary(
    {
      instanceKey,
      closedWithinDays: days,
      referenceString: getLatest(latestWorkItemEvent, latestCommit)

    }
  )
  if (loading ) return <Loading/>;
  if (error) return null;
  const {workItemStateTypeCounts, specStateTypeCounts} = data['project'];


  return (
    <ProjectPipelineFunnelView
      context={context}
      workItemStateTypeCounts={workItemStateTypeCounts}
      specStateTypeCounts={specStateTypeCounts}
      selectedGrouping={selectedGrouping}
      setSelectedGrouping={setSelectedGrouping}
      view={view}
    />
  )

}




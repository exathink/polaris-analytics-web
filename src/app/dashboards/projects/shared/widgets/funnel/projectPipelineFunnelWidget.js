import React, { useState } from 'react';
import {Loading} from "../../../../../components/graphql/loading";
import {useQueryProjectPipelineSummary} from "../../hooks/useQueryProjectPipelineSummary";
import {ProjectPipelineFunnelView} from "./projectPipelineFunnelView";
import {getLatest} from "../../../../../helpers/utility";
import {ProjectPipelineDetailDashboard} from './projectPipelineDetailDashboard';

export const ProjectPipelineFunnelWidget = (
  {
    instanceKey,
    latestWorkItemEvent,
    latestCommit,
    workItemScope,
    setWorkItemScope,
    days,
    view,
    context,
    pollInterval
  }) => {

  const [selectedGrouping, setSelectedGrouping] = useState(workItemScope || 'specs')
  const {loading, error, data} = useQueryProjectPipelineSummary(
    {
      instanceKey,
      closedWithinDays: days,
      specsOnly: selectedGrouping === 'specs',
      referenceString: getLatest(latestWorkItemEvent, latestCommit)
    }
  )
  if (loading ) return <Loading/>;
  if (error) return null;
  const {workItemStateTypeCounts, totalEffortByStateType} = data['project'];


  return view === "primary" ? (
    <ProjectPipelineFunnelView
      context={context}
      workItemStateTypeCounts={workItemStateTypeCounts}
      totalEffortByStateType={totalEffortByStateType}
      workItemScope={workItemScope || selectedGrouping}
      setWorkItemScope={setWorkItemScope || setSelectedGrouping}
      view={view}
    />
  ) : (
    <ProjectPipelineDetailDashboard
      instanceKey={instanceKey}
      context={context}
      workItemScope={workItemScope}
      setWorkItemScope={setWorkItemScope}
      latestWorkItemEvent={latestWorkItemEvent}
      latestCommit={latestCommit}
      days={30}
      view={view}
    />
  );

}




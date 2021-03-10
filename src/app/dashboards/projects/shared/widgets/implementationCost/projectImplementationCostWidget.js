import React from "react";

import {useQueryProjectImplementationCost} from "./useQueryProjectImplementationCost";
import {getReferenceString} from "../../../../../helpers/utility";
import {Loading} from "../../../../../components/graphql/loading";
import {logGraphQlError} from "../../../../../components/graphql/utils";

import {ProjectImplementationCostView} from "./projectImplementationCostView";

export const ProjectImplementationCostWidget = (
  {
    instanceKey,
    activeOnly,
    specsOnly,
    title,
    subtitle,
    days,
    latestCommit,
    latestWorkItemEvent,
    view,
    context,
    showHierarchy
  }
) => {
  const {loading, error, data} = useQueryProjectImplementationCost({
    instanceKey,
    activeOnly,
    specsOnly,
    days: days,
    referenceString: getReferenceString(latestWorkItemEvent, latestCommit)
  })
  if (loading) return <Loading/>;
  if (error) {
    logGraphQlError('ProjectPipelineImplementationCostWidget.pipelineStateDetails', error);
    return null;
  }

  const workItemDeliveryCycles = data.project.workItemDeliveryCycles.edges.map( edge => edge.node );

  return (
    <ProjectImplementationCostView
      instanceKey={instanceKey}
      latestWorkItemEvent={latestWorkItemEvent}
      latestCommit={latestCommit}
      workItems={workItemDeliveryCycles}
      specsOnly={specsOnly}
      activeOnly={activeOnly}
      days={days}
      title={title}
      subtitle={subtitle}
      view={view}
      context={context}
      showHierarchy={showHierarchy}
      />
  )
}


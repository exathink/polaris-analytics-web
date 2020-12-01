import React from 'react';
import {Loading} from "../../../../../components/graphql/loading";
import {useQueryProjectPipelineStateDetails} from "../../hooks/useQueryProjectPipelineStateDetails";
import {ProjectPipelineImplementationCostView} from "./projectPipelineImplementationCostView";
import {getReferenceString} from "../../../../../helpers/utility";
import {logGraphQlError} from "../../../../../components/graphql/utils";


export const ProjectPipelineImplementationCostWidget = (
  {
    instanceKey,
    specsOnly,
    wipLimit,
    workItemScope,
    setWorkItemScope,

    latestWorkItemEvent,
    latestCommit,
    view,
    context
  }
) => {



  const {loading, error, data} = useQueryProjectPipelineStateDetails({
    instanceKey,
    specsOnly,
    referenceString: getReferenceString(latestWorkItemEvent, latestCommit)
  })
  if (loading) return <Loading/>;
  if (error) {
    logGraphQlError('ProjectPipelineImplementationCostWidget.pipelineStateDetails', error);
    return null;
  }
  const workItems = data['project']['workItems']['edges'].map(edge => edge.node);

  return (
      <ProjectPipelineImplementationCostView
        specsOnly={specsOnly}
        workItemScope={workItemScope}
        setWorkItemScope={setWorkItemScope}
        workItems={workItems}
        view={view}
        context={context}
      />
  )
}
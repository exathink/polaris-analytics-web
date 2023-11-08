import React from 'react';
import {Loading} from "../../../../../../components/graphql/loading";
import {useQueryDimensionWorkItemDetails} from "../../hooks/useQueryDimensionWorkItemDetails";
import {DimensionWipEffortView} from "./dimensionWipEffortView";
import {getReferenceString} from "../../../../../../helpers/utility";
import {logGraphQlError} from "../../../../../../components/graphql/utils";


export const DimensionWipEffortWidget = (
  {
    dimension,
    instanceKey,
    specsOnly,
    wipLimit,
    workItemScope,
    setWorkItemScope,

    latestWorkItemEvent,
    latestCommit,
    view,
    context,
    includeSubTasks,
  }
) => {



  const {loading, error, data} = useQueryDimensionWorkItemDetails({
    dimension,
    instanceKey,
    specsOnly,
    activeOnly: true,
    includeSubTasks: includeSubTasks,
    referenceString: getReferenceString(latestWorkItemEvent, latestCommit)
  })
  if (loading) return <Loading/>;
  if (error) {
    logGraphQlError('DimensionWipEffortWidget.pipelineStateDetails', error);
    return null;
  }
  const workItems = data[dimension]['workItems']['edges'].map(edge => edge.node);

  return (
      <DimensionWipEffortView
        specsOnly={specsOnly}
        workItemScope={workItemScope}
        setWorkItemScope={setWorkItemScope}
        workItems={workItems}
        view={view}
        context={context}
      />
  )
}
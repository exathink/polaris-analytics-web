import React from "react";

import {useQueryProjectEpicEffort} from "./useQueryProjectEpicEffort";
import {getReferenceString} from "../../../../../helpers/utility";
import {Loading} from "../../../../../components/graphql/loading";
import {logGraphQlError} from "../../../../../components/graphql/utils";

import {ProjectValueBookView} from "./projectValueBookView";

export const ProjectValueBookWidget = ({
  instanceKey,
  tags,
  activeOnly,
  specsOnly,
  title,
  subtitle,
  days,
  latestCommit,
  latestWorkItemEvent,
  view,
  context,
  showHierarchy,
  includeSubTasks,
  workItemScope,
  setWorkItemScope,
  setClosedWithinDays
}) => {
  const {loading, error, data} = useQueryProjectEpicEffort({
    instanceKey,
    tags,
    activeOnly,
    specsOnly,
    days: days,
    includeSubTasks,
    referenceString: getReferenceString(latestWorkItemEvent, latestCommit),
  });
  if (loading) return <Loading />;
  if (error) {
    logGraphQlError("DimensionValueBookWidget.queryProjectEpicEffort", error);
    return null;
  }

  const workItemDeliveryCycles = data.project.workItems.edges.map((edge) => edge.node);

  return (
    <ProjectValueBookView
      instanceKey={instanceKey}
      tags={tags}
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
      includeSubTasks={includeSubTasks}
      workItemScope={workItemScope}
      setWorkItemScope={setWorkItemScope}
      setClosedWithinDays={setClosedWithinDays}
    />
  );
};

import React from "react";
import {Loading} from "../../../../components/graphql/loading";

import {useQueryWorkItemEventTimeline} from "../hooks/useQueryWorkItemEventTimeline";
import {WorkItemEventTimelineView} from "./workItemEventTimelineView";
import {pick} from "../../../../helpers/utility";

export function getWorkItem(data) {
  const workItem = {
    ...pick(data.workItem, "displayId", "workItemType", "state", "stateType"),
    workItemEvents: data.workItem.workItemEvents.edges.map((edge) => edge.node),
    workItemCommits: data.workItem.commits.edges.map((edge) => edge.node),
    workItemPullRequests: data.workItem.pullRequests.edges.map(edge => edge.node)
  };
  return workItem
}

export const WorkItemEventTimelineWidget = ({instanceKey, latestWorkItemEvent, latestCommit, view, context}) => {
  const {loading, error, data} = useQueryWorkItemEventTimeline({instanceKey, latestWorkItemEvent, latestCommit});

  if (loading) return <Loading />;
  if (error) return "Boom";
  const workItem = getWorkItem(data);
  return <WorkItemEventTimelineView workItem={workItem} view={view} context={context} />;
};

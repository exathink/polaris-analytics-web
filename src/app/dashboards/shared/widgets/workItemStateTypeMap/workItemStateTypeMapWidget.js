import React from "react";
import {useQueryProjectWorkItemsSourceStateMappings} from "../../../projects/shared/hooks/useQueryProjectWorkItemsSourceStateMappings";
import {WorkItemStateTypeMapView} from "./workItemStateTypeMapView";
import {Loading} from "../../../../components/graphql/loading";
import {logGraphQlError} from "../../../../components/graphql/utils";

// can also come from backend
export const ALL_STATE_TYPES = [
  {key: "unmapped", displayValue: "Unmapped"},
  {key: "backlog", displayValue: "Define"},
  {key: "wip", displayValue: "Build"},
  {key: "complete", displayValue: "Deliver"},
  {key: "open", displayValue: "Open"},
  {key: "closed", displayValue: "Closed"},
];

export const WorkItemStateTypeMapWidget = ({
  instanceKey,
  latestWorkItemEvent,
  latestCommit,
  days,
  view,
  context,
  pollInterval,
}) => {
  const {loading, error, data} = useQueryProjectWorkItemsSourceStateMappings({instanceKey});
  if (loading) return <Loading />;
  if (error) {
    logGraphQlError(".", error);
    return null;
  }

  const workItemSources = data["project"]["workItemsSources"]["edges"].map((e) => e.node);

  return (
    <WorkItemStateTypeMapView
      instanceKey={instanceKey}
      workItemSources={workItemSources}
      context={context}
      view={view}
    />
  );
};

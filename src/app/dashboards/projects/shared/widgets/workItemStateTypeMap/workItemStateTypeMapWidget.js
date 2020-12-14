import React from "react";
import {useQueryProjectWorkItemsSourceStateMappings} from "../../hooks/useQueryProjectWorkItemsSourceStateMappings";
import {WorkItemStateTypeMapView} from "./workItemStateTypeMapView";
import {Loading} from "../../../../../components/graphql/loading";
import {logGraphQlError} from "../../../../../components/graphql/utils";

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
    logGraphQlError("useQueryProjectWorkItemsSourceStateMappings", error);
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
  )
};

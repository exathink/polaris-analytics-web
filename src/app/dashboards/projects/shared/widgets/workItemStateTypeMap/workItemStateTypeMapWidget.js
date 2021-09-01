import React from "react";
import {useQueryProjectWorkItemsSourceStateMappings} from "../../hooks/useQueryProjectWorkItemsSourceStateMappings";
import {WorkItemStateTypeMapView} from "./workItemStateTypeMapView";
import {Loading} from "../../../../../components/graphql/loading";
import {logGraphQlError} from "../../../../../components/graphql/utils";
import {withViewerContext} from "../../../../../framework/viewer/viewerContext";

export const WorkItemStateTypeMapWidget = withViewerContext(
  ({instanceKey, latestWorkItemEvent, latestCommit, days, view, context, viewerContext, pollInterval, showMeLinkVisible}) => {
    const {loading, error, data} = useQueryProjectWorkItemsSourceStateMappings({instanceKey});
    if (loading) return <Loading />;
    if (error) {
      logGraphQlError("useQueryProjectWorkItemsSourceStateMappings", error);
      return null;
    }

    const workItemSources = data["project"]["workItemsSources"]["edges"].map((e) => e.node);
    const organizationKey = data["project"]["organizationKey"];

    // only enable edits for org owner
    const enableEdits = viewerContext.isOrganizationOwner(organizationKey);

    return (
      <WorkItemStateTypeMapView
        instanceKey={instanceKey}
        workItemSources={workItemSources}
        enableEdits={enableEdits}
        context={context}
        view={view}
        showMeLinkVisible={showMeLinkVisible}
      />
    );
  }
);

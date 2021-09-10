import React from "react";
import {useQueryProjectWorkItemsSourceStateMappings} from "../../hooks/useQueryProjectWorkItemsSourceStateMappings";
import {WorkItemStateTypeMapView} from "./workItemStateTypeMapView";
import {Loading} from "../../../../../components/graphql/loading";
import {logGraphQlError} from "../../../../../components/graphql/utils";
import {withViewerContext} from "../../../../../framework/viewer/viewerContext";
import styles from "./workItemStateType.module.css";
import { InfoCard } from "../../../../../components/misc/info";
import { StateMappingInfoContent } from "../../../configure/stateMappingInfoContent";

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


WorkItemStateTypeMapWidget.infoConfig = {
  title:"Delivery Process Mapping",
  headerContent: () => (
    <div style={{textAlign: "center", maxWidth: "400px"}}>
      <h3>Why</h3>
      <p>Polaris models your delivery process by mapping states in your workflow into five standard <em>phases</em>. See mapping guidelines below for the definitions of each phase.
      </p>
      <p>
      Key metrics like lead and cycle time
        are defined in terms of cumulative time spent in these phases.
      </p>
      <h3>How</h3>
      <p>
         Drag and drop each state on its desired phase to map your delivery process into Polaris phases.
      </p>
      <p>
        Every workflow state that is unmapped, including ones you are not actively using now, should be mapped.
      </p>
      <p>
        Time spent in unmapped states is not included
        in cycle metrics calculations, so not mapping them can skew your metrics.
      </p>
      <p>
        You can update this mapping at any time. But note that when you do, Polaris recomputes cycle metrics for <em>both historical and future cards</em> using the new phase mapping.
      </p>
    </div>
  ),
  moreLinkText: "Mapping guidelines...",
  drawerContent: () => (
    <StateMappingInfoContent header={true}/>
  ),
  showDrawerTitle: false,
  drawerOptions: {

    placement: "top",
    height: "60vh",
  }
}
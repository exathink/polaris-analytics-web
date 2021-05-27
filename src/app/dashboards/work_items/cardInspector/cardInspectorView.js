import {Dashboard, DashboardRow, DashboardWidget} from "../../../framework/viz/dashboard";
import {WorkItemDurationDetailsByPhaseWidget} from "../activity/durationDetails/workItemDurationDetailsByPhaseWidget";
import {WorkItemDurationDetailsByStateWidget} from "../activity/durationDetails/workItemDurationDetailsByStateWidget";
import {WorkItemEventTimelineWidget} from "../activity/eventTimeline/workItemEventTimelineWidget";
import {WorkItemFlowMetricsWidget} from "../activity/flowMetrics/workItemFlowMetricsWidget";
import {WorkItemImplementationCostWidget} from "../activity/implementationCosts/workItemImplementationCostWidget";
import {WorkItemRemoteLink} from "../activity/views/workItemRemoteLink";
import {WorkItemStateView} from "../activity/views/workItemStateView";

const dashboard_id = "dashboards.work_items.work_item.card_inspector";
export function CardInspectorView({workItem, context}) {
  return (
    <Dashboard dashboard={`${dashboard_id}`}>
      <DashboardRow h={"15%"}>
        <DashboardWidget w={1} name="name" render={() => <WorkItemRemoteLink workItem={workItem} />} />
      </DashboardRow>
      <DashboardRow h={"25%"}>
        <DashboardWidget
          w={1 / 3}
          name="header"
          render={({view}) => <WorkItemStateView workItem={workItem} view={view} />}
        />
        <DashboardWidget
          w={1 / 3}
          name="cycle-metrics"
          render={({view}) => (
            <WorkItemFlowMetricsWidget
              instanceKey={workItem.key}
              latestWorkItemEvent={workItem.latestWorkItemEvent}
              view={view}
            />
          )}
        />
        <DashboardWidget
          w={1 / 3}
          name="implementation-cost"
          render={({view}) => (
            <WorkItemImplementationCostWidget
              instanceKey={workItem.key}
              latestWorkItemEvent={workItem.latestWorkItemEvent}
              view={view}
            />
          )}
        />
      </DashboardRow>
      <DashboardRow h={"60%"}>
        <DashboardWidget
          w={1 / 3}
          name="duration-detail-by-phase"
          render={({view}) => (
            <WorkItemDurationDetailsByPhaseWidget
              instanceKey={workItem.key}
              latestWorkItemEvent={workItem.latestWorkItemEvent}
              view={view}
            />
          )}
          showDetail={true}
        />
        <DashboardWidget
          w={1 / 3}
          name="timeline"
          render={({view}) => (
            <WorkItemEventTimelineWidget
              instanceKey={workItem.key}
              latestWorkItemEvent={workItem.latestWorkItemEvent}
              latestCommit={workItem.latestCommit}
              view={view}
              context={context}
            />
          )}
          showDetail={true}
        />
        <DashboardWidget
          w={1 / 3}
          name="duration-detail-by-state"
          render={({view}) => (
            <WorkItemDurationDetailsByStateWidget
              instanceKey={workItem.key}
              latestWorkItemEvent={workItem.latestWorkItemEvent}
              view={view}
            />
          )}
        />
      </DashboardRow>
    </Dashboard>
  );
}

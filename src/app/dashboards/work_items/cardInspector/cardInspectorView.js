import {Dashboard, DashboardRow, DashboardWidget} from "../../../framework/viz/dashboard";
import {WorkItemDurationDetailsByPhaseWidget} from "../activity/durationDetails/workItemDurationDetailsByPhaseWidget";
import {WorkItemDurationDetailsByStateWidget} from "../activity/durationDetails/workItemDurationDetailsByStateWidget";
import {WorkItemEventTimelineWidget} from "../activity/eventTimeline/workItemEventTimelineWidget";
import {WorkItemFlowMetricsWidget} from "../activity/flowMetrics/workItemFlowMetricsWidget";
import {WorkItemImplementationCostWidget} from "../activity/implementationCosts/workItemImplementationCostWidget";
import {WorkItemRemoteLink} from "../activity/views/workItemRemoteLink";
import {WorkItemStateView} from "../activity/views/workItemStateView";
import styles from "./cardInspector.module.css";

const dashboard_id = "dashboards.work_items.work_item.card_inspector";
export function CardInspectorView({workItem, context}) {
  return (
    <Dashboard dashboard={`${dashboard_id}`} gridLayout={true} className={styles.cardInspectorDashboard}>
      <DashboardRow>
        <DashboardWidget
          name="name"
          className={styles.remoteLink}
          render={() => <WorkItemRemoteLink workItem={workItem} />}
        />
      </DashboardRow>
      <DashboardRow>
        <DashboardWidget
          name="header"
          className={styles.workItemStateView}
          render={({view}) => <WorkItemStateView workItem={workItem} view={view} />}
        />
        <DashboardWidget
          name="cycle-metrics"
          className={styles.workItemFlowMetrics}
          render={({view}) => (
            <WorkItemFlowMetricsWidget
              instanceKey={workItem.key}
              latestWorkItemEvent={workItem.latestWorkItemEvent}
              view={view}
            />
          )}
        />
        <DashboardWidget
          name="implementation-cost"
          className={styles.workItemImplementationCost}
          render={({view}) => (
            <WorkItemImplementationCostWidget
              instanceKey={workItem.key}
              latestWorkItemEvent={workItem.latestWorkItemEvent}
              view={view}
            />
          )}
        />
      </DashboardRow>
      <DashboardRow>
        <DashboardWidget
          name="duration-detail-by-phase"
          className={styles.workItemByPhase}
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
          name="timeline"
          className={styles.workItemEventTimeline}
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
          name="duration-detail-by-state"
          className={styles.workItemByState}
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

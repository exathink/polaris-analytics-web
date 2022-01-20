import {Dashboard, DashboardRow, DashboardWidget} from "../../../framework/viz/dashboard";
import {ComboCardStateTypeColumn, ComboCardTitleColumn} from "../../projects/shared/helper/renderers";
import {getWorkItemDurations} from "../../shared/widgets/work_items/clientSideFlowMetrics";
import {WorkItemDurationDetailsByPhaseWidget} from "../activity/durationDetails/workItemDurationDetailsByPhaseWidget";
import {WorkItemDurationDetailsByStateWidget} from "../activity/durationDetails/workItemDurationDetailsByStateWidget";
import {WorkItemEventTimelineWidget} from "../activity/eventTimeline/workItemEventTimelineWidget";
import {WorkItemFlowMetricsWidget} from "../activity/flowMetrics/workItemFlowMetricsWidget";
import {WorkItemImplementationCostWidget} from "../activity/implementationCosts/workItemImplementationCostWidget";
import {WorkItemButtons} from "../activity/views/workItemRemoteLink";
import styles from "./cardInspector.module.css";

const dashboard_id = "dashboards.work_items.work_item.card_inspector";
export function CardInspectorView({workItem, context}) {
  const [workItemDurations] = getWorkItemDurations([workItem]);
  return (
    <Dashboard dashboard={`${dashboard_id}`} gridLayout={true} className={styles.cardInspectorDashboard}>
      <DashboardRow>
        <DashboardWidget
          name="name"
          className={styles.remoteLink}
          render={({view}) => <div className={styles.headerRow}><ComboCardTitleColumn record={workItemDurations}/><WorkItemButtons workItem={workItem} /></div>}
        />
      </DashboardRow>
      <DashboardRow>
        <DashboardWidget
          name="header"
          className={styles.workItemStateView}
          render={({view}) => <ComboCardStateTypeColumn record={workItemDurations}/>}
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

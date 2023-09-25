import React from 'react';
import {Dashboard, DashboardRow, DashboardWidget} from '../../../framework/viz/dashboard';

import {WorkItemDashboard} from "../workItemDashboard";
import {withViewerContext} from "../../../framework/viewer/viewerContext";

import {WorkItemFlowMetricsWidget} from "./flowMetrics/workItemFlowMetricsWidget";
import {WorkItemDurationDetailsByPhaseWidget} from "./durationDetails/workItemDurationDetailsByPhaseWidget";
import {WorkItemEventTimelineWidget} from "./eventTimeline/workItemEventTimelineWidget";
import {WorkItemButtons} from "./views/workItemRemoteLink";
import {DimensionCommitsNavigatorWidget} from "../../shared/widgets/accountHierarchy";
import {WorkItemImplementationCostWidget} from "./implementationCosts/workItemImplementationCostWidget";
import {WorkItemDurationDetailsByStateWidget} from "./durationDetails/workItemDurationDetailsByStateWidget";
import styles from "./dashboard.module.css";
import {ComboCardStateTypeColumn, ComboCardTitleColumn} from "../../projects/shared/helper/renderers";
import {getWorkItemDurations} from "../../shared/widgets/work_items/clientSideFlowMetrics";

const dashboard_id = 'dashboards.work_items.work_item.instance';


export const dashboard =
  ({viewerContext}) => (
    <WorkItemDashboard
      pollInterval={1000 * 60}
      render={
        ({
           workItem,
           context
         }) => {
          const [workItemDurations] = getWorkItemDurations([workItem]);
          return (
            <Dashboard dashboard={`${dashboard_id}`} gridLayout={true} className={styles.cardInspectorDashboard}>
              <DashboardRow h={'5%'}>
                <DashboardWidget
                  name="name"
                  className={styles.remoteLink}
                  render={({view}) => <div className={styles.workItemHeaderRow}><ComboCardTitleColumn record={workItemDurations}/><WorkItemButtons workItem={workItem} goToCardLink={false}/></div>}
                />
              </DashboardRow>
              <DashboardRow
                h={"12%"}
              >
                <DashboardWidget
                  name="header"
                  className={styles.workItemStateView}
                  render={({view}) => <ComboCardStateTypeColumn record={workItemDurations}/>}
                />
                <DashboardWidget
                  name="cycle-metrics"
                  className={styles.workItemFlowMetrics}
                  render={
                    ({view}) =>
                      <WorkItemFlowMetricsWidget
                        instanceKey={workItem.key}
                        latestWorkItemEvent={workItem.latestWorkItemEvent}

                        view={view}
                      />
                  }
                />
                <DashboardWidget
                  name="implementation-cost"
                  className={styles.workItemImplementationCost}
                  render={
                    ({view}) =>
                      <WorkItemImplementationCostWidget
                        instanceKey={workItem.key}
                        latestWorkItemEvent={workItem.latestWorkItemEvent}

                        view={view}
                      />
                  }
                />
              </DashboardRow>
              <DashboardRow
                h={'25%'}
              >

                <DashboardWidget
                  name="duration-detail-by-phase"
                  className={styles.workItemByPhase}
                  render={
                    ({view}) =>
                      <WorkItemDurationDetailsByPhaseWidget
                        instanceKey={workItem.key}
                        latestWorkItemEvent={workItem.latestWorkItemEvent}
                        view={view}
                      />
                  }
                  showDetail={true}
                />
                <DashboardWidget
                  name="timeline"
                  className={styles.workItemEventTimeline}
                  render={
                    ({view}) =>
                      <WorkItemEventTimelineWidget
                        instanceKey={workItem.key}
                        latestWorkItemEvent={workItem.latestWorkItemEvent}
                        latestCommit={workItem.latestCommit}
                        view={view}
                        context={context}
                      />
                  }
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
              <DashboardRow h={'55%'}>
                <DashboardWidget
                  name="commits"
                  className={styles.commits}
                  title={"Commit History"}
                  render={
                    ({view}) =>
                      <DimensionCommitsNavigatorWidget
                        dimension={'workItem'}
                        instanceKey={workItem.key}
                        context={context}
                        view={view}

                        latestCommit={workItem.latestCommit}
                        latestWorkItemEvent={workItem.latestWorkItemEvent}
                        groupBy={'author'}
                        groupings={['author', 'repository', 'branch', 'team']}
                        showHeader
                        showTable
                      />
                  }
                  showDetail={true}
                />
              </DashboardRow>
            </Dashboard>

          )
        }
      }

    />
  );

export default withViewerContext(dashboard);


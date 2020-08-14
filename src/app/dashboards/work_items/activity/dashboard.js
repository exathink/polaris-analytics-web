import React from 'react';
import {Dashboard, DashboardRow, DashboardWidget} from '../../../framework/viz/dashboard';


import {WorkItemStateView} from "./views/workItemStateView";

import {WorkItemDashboard} from "../workItemDashboard";
import {withViewerContext} from "../../../framework/viewer/viewerContext";

import {WorkItemFlowMetricsWidget} from "./flowMetrics/workItemFlowMetricsWidget";
import {WorkItemDurationDetailsWidget} from "./durationDetails/workItemDurationDetailsWidget";
import {WorkItemEventTimelineWidget} from "./eventTimeline/workItemEventTimelineWidget";
import {WorkItemRemoteLink} from "./views/workItemRemoteLink";
import {DimensionCommitsNavigatorWidget} from "../../shared/widgets/accountHierarchy";
import {WorkItemImplementationCostWidget} from "./implementationCosts/workItemImplementationCostWidget";

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
          return (
            <Dashboard dashboard={`${dashboard_id}`}>
              <DashboardRow h={'5%'}>
                <DashboardWidget
                  w={1}
                  name="name"
                  render={
                    () =>
                      <WorkItemRemoteLink workItem={workItem}/>
                  }
                />
              </DashboardRow>
              <DashboardRow
                h={"12%"}
              >
                <DashboardWidget
                  w={1 / 3}
                  name="header"
                  render={
                    ({view}) =>
                      <WorkItemStateView
                        workItem={workItem}
                        view={view}
                      />
                  }
                />
                <DashboardWidget
                  w={1 / 3}
                  name="cycle-metrics"
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
                  w={1 / 3}
                  name="implementation-cost"
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
                  w={2/3}
                  name="duration-detail"
                  render={
                    ({view}) =>
                      <WorkItemDurationDetailsWidget
                        instanceKey={workItem.key}
                        latestWorkItemEvent={workItem.latestWorkItemEvent}
                        view={view}
                      />
                  }
                  showDetail={true}
                />
                <DashboardWidget
                  w={1/3}
                  name="timeline"
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
              </DashboardRow>
              <DashboardRow h={'55%'}>
                <DashboardWidget
                  w={1}
                  name="commits"
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
                        groupings={['author', 'repository', 'branch']}
                        showHeader
                        showTable
                        hideTraceability
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


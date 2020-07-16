import React from 'react';
import {ProjectDashboard} from "../projectDashboard";
import {withViewerContext} from "../../../framework/viewer/viewerContext";
import {ProjectFlowMetricsTrendsWidget} from "./flowMetrics"
import {ProjectThroughputTrendsWidget} from "./throughput"
import {Dashboard, DashboardRow, DashboardWidget} from "../../../framework/viz/dashboard";

const dashboard_id = 'dashboards.trends.projects.dashboard.instance';
const dashboard = ({viewerContext}) => (
  <ProjectDashboard
    pollInterval={1000 * 60}
    render={
      ({
         project: {
           key,
           latestWorkItemEvent,
           latestCommit
         },
         context
       }) => {
        return (
          <Dashboard dashboard={`${dashboard_id}`}>
            <DashboardRow
              h='40%'
              title={`Flow Metrics`}
            >
              <DashboardWidget
                w={1/3}
                name="throughput"

                render={
                  ({view}) =>
                    <ProjectThroughputTrendsWidget
                      instanceKey={key}
                      measurementWindow={30}
                      days={45}
                      samplingFrequency={7}
                      targetPercentile={0.7}
                      context={context}
                      view={view}
                      latestWorkItemEvent={latestWorkItemEvent}
                    />
                }
                showDetail={true}
              />
              <DashboardWidget
                w={2/3}
                name="cycle-time"
                render={
                  ({view}) =>
                    <ProjectFlowMetricsTrendsWidget
                      instanceKey={key}
                      measurementWindow={30}
                      days={45}
                      samplingFrequency={7}
                      targetPercentile={0.7}
                      context={context}
                      view={view}
                      latestWorkItemEvent={latestWorkItemEvent}
                    />
                }
              />
            </DashboardRow>
          </Dashboard>
        );
      }}
  />
)
export default withViewerContext(dashboard);
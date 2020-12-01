import React from "react";
import {ProjectDashboard} from "../projectDashboard";
import {withViewerContext} from "../../../framework/viewer/viewerContext";
import {ProjectPredictabilityTrendsWidget} from "../shared/widgets/predictability";
import {ProjectVolumeTrendsWidget} from "../shared/widgets/throughput";
import {ProjectResponseTimeTrendsWidget} from "../shared/widgets/responseTime";
import {ProjectTraceabilityTrendsWidget} from "../shared/widgets/traceability";
import {ProjectPullRequestTrendsWidget} from "../shared/widgets/pullRequest";

import {PROJECTS_ALIGNMENT_TRENDS_WIDGETS} from "../../../../config/featureFlags";

import {Dashboard, DashboardRow, DashboardWidget} from "../../../framework/viz/dashboard";
import {ProjectFlowMixTrendsWidget} from "../shared/widgets/flowMix";
import {ProjectCapacityTrendsWidget} from "../shared/widgets/capacity";

const dashboard_id = "dashboards.trends.projects.dashboard.instance";
const dashboard = ({viewerContext}) => (
  <ProjectDashboard
    pollInterval={1000 * 60}
    render={({project: {key, latestWorkItemEvent, latestCommit}, context}) => {
      return (
        <Dashboard dashboard={`${dashboard_id}`}>
          {viewerContext.isFeatureFlagActive(PROJECTS_ALIGNMENT_TRENDS_WIDGETS) && (
            <DashboardRow h={"30%"} title={"Alignment"}>
              <DashboardWidget
                w={1 / 3}
                name="traceability"
                render={({view}) => (
                  <ProjectTraceabilityTrendsWidget
                    instanceKey={key}
                    measurementWindow={30}
                    days={45}
                    samplingFrequency={7}
                    context={context}
                    view={view}
                    latestWorkItemEvent={latestWorkItemEvent}
                    latestCommit={latestCommit}
                  />
                )}
                showDetail={true}
              />

              <DashboardWidget
                w={1 / 3}
                name="flow-mix"
                render={({view}) => (
                  <ProjectFlowMixTrendsWidget
                    instanceKey={key}
                    measurementWindow={30}
                    days={45}
                    samplingFrequency={7}
                    context={context}
                    view={view}
                    latestWorkItemEvent={latestWorkItemEvent}
                    latestCommit={latestCommit}
                    specsOnly={true}
                    asStatistic={false}
                  />
                )}
                showDetail={true}
              />
              <DashboardWidget
                w={1 / 3}
                name="capacity"
                render={({view}) => (
                  <ProjectCapacityTrendsWidget
                    instanceKey={key}
                    measurementWindow={30}
                    days={45}
                    samplingFrequency={7}
                    context={context}
                    view={view}
                    latestWorkItemEvent={latestWorkItemEvent}
                    latestCommit={latestCommit}
                    target={0.9}
                  />
                )}
                showDetail={true}
              />
            </DashboardRow>
          )}
          <DashboardRow h="30%" title={`Flow Metrics`}>
            <DashboardWidget
              w={1 / 3}
              name="throughput"
              render={({view}) => (
                <ProjectVolumeTrendsWidget
                  instanceKey={key}
                  measurementWindow={30}
                  days={45}
                  samplingFrequency={7}
                  targetPercentile={0.7}
                  context={context}
                  view={view}
                  latestWorkItemEvent={latestWorkItemEvent}
                />
              )}
              showDetail={true}
            />
            <DashboardWidget
              w={1 / 3}
              name="cycle-time"
              render={({view}) => (
                <ProjectResponseTimeTrendsWidget
                  instanceKey={key}
                  measurementWindow={30}
                  days={45}
                  samplingFrequency={7}
                  targetPercentile={0.7}
                  context={context}
                  view={view}
                  latestWorkItemEvent={latestWorkItemEvent}
                />
              )}
              showDetail={true}
            />
            <DashboardWidget
              w={1 / 3}
              name="predictability"
              render={({view}) => (
                <ProjectPredictabilityTrendsWidget
                  instanceKey={key}
                  measurementWindow={30}
                  days={45}
                  samplingFrequency={7}
                  targetPercentile={0.7}
                  context={context}
                  view={view}
                  latestWorkItemEvent={latestWorkItemEvent}
                />
              )}
              showDetail={true}
            />
          </DashboardRow>
          <DashboardRow h="30%" title={``}>
            <DashboardWidget
              w={1 / 3}
              name="pull-request"
              render={({view}) => (
                <ProjectPullRequestTrendsWidget
                  instanceKey={key}
                  measurementWindow={30}
                  days={45}
                  samplingFrequency={7}
                  context={context}
                  view={view}
                  latestCommit={latestCommit}
                />
              )}
              showDetail={true}
            />
          </DashboardRow>
        </Dashboard>
      );
    }}
  />
);
export default withViewerContext(dashboard);

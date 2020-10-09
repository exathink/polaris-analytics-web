import React from 'react';
import {ProjectDashboard} from "../projectDashboard";
import {withViewerContext} from "../../../framework/viewer/viewerContext";
import {ProjectPredictabilityTrendsWidget} from "./predictability"
import {ProjectThroughputTrendsWidget} from "./throughput"
import {ProjectResponseTimeTrendsWidget} from "./responseTime"
import {ProjectTraceabilityTrendsWidget} from "./traceability";

import {PROJECTS_ALIGNMENT_TRENDS_WIDGETS} from "../../../../config/featureFlags";

import {Dashboard, DashboardRow, DashboardWidget} from "../../../framework/viz/dashboard";
import {ProjectFlowMixTrendsWidget} from "./flowMix";
import {ProjectCapacityTrendsWidget} from "./capacity";

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
            {
              viewerContext.isFeatureFlagActive(PROJECTS_ALIGNMENT_TRENDS_WIDGETS) &&
              < DashboardRow
                h={"30%"}
                title={"Alignment"}
              >
                <DashboardWidget
                  w={1 / 3}
                  name="traceability"

                  render={
                    ({view}) =>
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
                  }
                  showDetail={true}
                />

                <DashboardWidget
                  w={1/3}
                  name="flow-mix"
                  render={
                    ({view}) =>
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
                  }
                  showDetail={true}

                />
                <DashboardWidget
                  w={1/3}
                  name="capacity"
                  render={
                    ({view}) =>
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
                  }
                  showDetail={true}
                />
              </DashboardRow>


            }
            <DashboardRow
              h='30%'
              title={`Flow Metrics`}
            >
              <DashboardWidget
                w={1 / 3}
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
                w={1 / 3}
                name="cycle-time"

                render={
                  ({view}) =>
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
                }
                showDetail={true}
              />
              <DashboardWidget
                w={1 / 3}
                name="predictability"
                render={
                  ({view}) =>
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
                }
                showDetail={true}
              />
            </DashboardRow>
          </Dashboard>
        );
      }}
  />
)
export default withViewerContext(dashboard);
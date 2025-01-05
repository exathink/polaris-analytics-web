import React from "react";
import { ProjectDashboard, useProjectContext } from "../../projectDashboard";
import { withViewerContext } from "../../../../framework/viewer/viewerContext";
import { DimensionVolumeTrendsWidget } from "../../../shared/widgets/work_items/trends/volume";
import { DimensionResponseTimeTrendsWidget } from "../../../shared/widgets/work_items/trends/responseTime";

import { Dashboard, DashboardRow, DashboardWidget } from "../../../../framework/viz/dashboard";
import { DimensionFlowMixTrendsWidget } from "../../../shared/widgets/work_items/trends/flowMix";
import { DaysRangeSlider, SIX_MONTHS } from "../../../shared/components/daysRangeSlider/daysRangeSlider";
import styles from "../../valueBook/dashboard.module.css";
import { ProjectValueBookWidget } from "../../../shared/widgets/work_items/valueBook";
import {ProjectTraceabilityTrendsWidget} from "../../../shared/widgets/commits/traceability";
import {useQueryParamState} from "../../shared/helper/hooks";

const dashboard_id = "dashboards.trends.projects.dashboard.instance";

function FlowMetricsTrendsDashboard({
  context,
  viewerContext,
}) {
  const {key, latestWorkItemEvent, latestCommit, settingsWithDefaults} = useProjectContext((result) => result.project);
  const {
    leadTimeTarget,
    cycleTimeTarget,
    leadTimeConfidenceTarget,
    cycleTimeConfidenceTarget,
    trendsAnalysisPeriod,
    includeSubTasksFlowMetrics,
  } = settingsWithDefaults;

  const [workItemScope, setWorkItemScope] = React.useState("specs");
  const specsOnly = workItemScope === "specs";
  const [daysRange, setDaysRange] = React.useState(trendsAnalysisPeriod);

  const {state} = useQueryParamState();
  const workItemSelectors = state?.vs?.workItemSelectors??[];
  const release = state?.release?.releaseValue;

  return (
    <Dashboard dashboard={`${dashboard_id}`}>
      <DashboardRow
        h="63%"
        title={`Flow Metrics`}
        controls={[
          () => (
            <div style={{minWidth: "500px"}}>
              <DaysRangeSlider initialDays={daysRange} setDaysRange={setDaysRange} range={SIX_MONTHS} />
            </div>
          ),
          workItemSelectors.length === 0
            ? (view) => (
                <div style={{minWidth: "150px", marginLeft: "60px", backgroundColor: "#f5f5f5"}}>
                  <ProjectTraceabilityTrendsWidget
                    instanceKey={key}
                    measurementWindow={daysRange}
                    days={daysRange}
                    samplingFrequency={daysRange}
                    context={context}
                    view={view}
                    latestWorkItemEvent={latestWorkItemEvent}
                    latestCommit={latestCommit}
                    asStatistic={{title: "Traceability"}}
                    primaryStatOnly={true}
                    target={0.9}
                  />
                </div>
              )
            : () => null,
        ]}
      >
        <DashboardWidget
          w={1 / 2}
          name="cycle-time"
          render={({view}) => (
            <DimensionResponseTimeTrendsWidget
              dimension={"project"}
              tags={workItemSelectors}
              release={release}
              title={"Flow Time, All Dev Items"}
              instanceKey={key}
              measurementWindow={30}
              days={daysRange}
              samplingFrequency={30}
              leadTimeTarget={leadTimeTarget}
              cycleTimeTarget={cycleTimeTarget}
              leadTimeConfidenceTarget={leadTimeConfidenceTarget}
              cycleTimeConfidenceTarget={cycleTimeConfidenceTarget}
              targetPercentile={cycleTimeConfidenceTarget}
              context={context}
              view={view}
              showAnnotations={true}
              latestWorkItemEvent={latestWorkItemEvent}
              defaultSeries={["leadTime", "cycleTime", "effort"]}
              includeSubTasks={includeSubTasksFlowMetrics}
            />
          )}
          showDetail={true}
        />
        <DashboardWidget
          w={1 / 2}
          name="throughput"
          render={({view}) => (
            <DimensionVolumeTrendsWidget
              dimension={"project"}
              tags={workItemSelectors}
              release={release}
              instanceKey={key}
              measurementWindow={30}
              days={daysRange}
              samplingFrequency={30}
              targetPercentile={0.7}
              context={context}
              view={view}
              latestWorkItemEvent={latestWorkItemEvent}
              leadTimeTarget={leadTimeTarget}
              cycleTimeTarget={cycleTimeTarget}
              leadTimeConfidenceTarget={leadTimeConfidenceTarget}
              cycleTimeConfidenceTarget={cycleTimeConfidenceTarget}
              includeSubTasks={includeSubTasksFlowMetrics}
            />
          )}
          showDetail={true}
        />
      </DashboardRow>
    </Dashboard>
  );
}

const dashboard = ({viewerContext}) => (
  <ProjectDashboard pollInterval={1000 * 60}>
    <FlowMetricsTrendsDashboard viewerContext={viewerContext} />
  </ProjectDashboard>
);
export default withViewerContext(dashboard);

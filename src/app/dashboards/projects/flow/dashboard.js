import React, {useState} from "react";
import {Dashboard, DashboardRow, DashboardWidget} from "../../../framework/viz/dashboard";
import {DimensionWipFlowMetricsWidget} from "../../shared/widgets/work_items/wip";
import {DimensionFlowMetricsWidget} from "../../shared/widgets/work_items/closed/flowMetrics";
import {ProjectPipelineFunnelWidget} from "../shared/widgets/funnel";
import {withViewerContext} from "../../../framework/viewer/viewerContext";
import {ProjectDashboard} from "../projectDashboard";
import {ProjectTraceabilityTrendsWidget} from "../../shared/widgets/commits/traceability";
import { DimensionResponseTimeTrendsWidget } from "../../shared/widgets/work_items/trends/responseTime";
import { DimensionVolumeTrendsWidget } from "../../shared/widgets/work_items/trends/volume";
import styles from "../../projects/flow/dashboard.module.css";
import { DimensionValueStreamPhaseDetailWidget } from "../../shared/widgets/work_items/valueStreamPhaseDetail";
import {ThroughputWidget} from "../../shared/widgets/work_items/throughput/throughputWidget";

const dashboard_id = "dashboards.activity.projects.newDashboard.instance";



function FlowDashboard({project: {key, latestWorkItemEvent, latestCommit, settings, settingsWithDefaults}, context}) {
  const [workItemScope, setWorkItemScope] = useState("all");
  const specsOnly = workItemScope === "specs";

  const {
    leadTimeTarget,
    cycleTimeTarget,
    responseTimeConfidenceTarget,
    leadTimeConfidenceTarget,
    cycleTimeConfidenceTarget,
    flowAnalysisPeriod,
    wipLimit,
    includeSubTasksFlowMetrics,
    includeSubTasksWipInspector
  } = settingsWithDefaults;

  return (
    <Dashboard dashboard={`${dashboard_id}`} className={styles.flowDashboard} gridLayout={true}>
      <DashboardRow h="12%">
        <DashboardWidget
          name="flow-metrics"
          title={"Throughput"}
          className={styles.throughput}
          subtitle={`Specs, Last ${flowAnalysisPeriod} days`}
          hideTitlesInDetailView={true}
          render={({ view }) => (
            <ThroughputWidget
              dimension={"project"}
              instanceKey={key}
              view={view}
              context={context}
              specsOnly={true}
              days={flowAnalysisPeriod}
              measurementWindow={flowAnalysisPeriod}
              targetPercentile={responseTimeConfidenceTarget}
              leadTimeTarget={leadTimeTarget}
              cycleTimeTarget={cycleTimeTarget}
              leadTimeConfidenceTarget={leadTimeConfidenceTarget}
              cycleTimeConfidenceTarget={cycleTimeConfidenceTarget}
              includeSubTasks={includeSubTasksFlowMetrics}
              latestCommit={latestCommit}
              latestWorkItemEvent={latestWorkItemEvent}
            />
          )}
          showDetail={false}
        />
        <DashboardWidget
          name="pipeline"
          className={styles.pipeline}
          title={"Work In Progress"}
          subtitle={"Specs"}

          render={({view}) => (
            <DimensionWipFlowMetricsWidget
              dimension={'project'}
              instanceKey={key}
              display={"commonWipSummary"}
              days={flowAnalysisPeriod}
              targetPercentile={responseTimeConfidenceTarget}
              leadTimeTargetPercentile={leadTimeConfidenceTarget}
              cycleTimeTargetPercentile={cycleTimeConfidenceTarget}
              cycleTimeTarget={cycleTimeTarget}
              wipLimit={wipLimit}
              view={view}
              specsOnly={true}
              context={context}
              includeSubTasks={includeSubTasksWipInspector}
              latestCommit={latestCommit}
              latestWorkItemEvent={latestWorkItemEvent}
            />
          )}
          showDetail={false}
          hideTitlesInDetailView={true}
        />

        <DashboardWidget
          name="flow-metrics"
          title={"Response Time"}
          className={styles.leadAndCycleTime}
          subtitle={`Specs, Last ${flowAnalysisPeriod} days`}
          hideTitlesInDetailView={true}
          render={({ view }) => (
            <DimensionFlowMetricsWidget
              dimension={"project"}
              instanceKey={key}
              view={view}
              display={"leadAndCycleTimeSummary"}
              context={context}
              specsOnly={true}
              days={flowAnalysisPeriod}
              measurementWindow={flowAnalysisPeriod}
              targetPercentile={responseTimeConfidenceTarget}
              leadTimeTarget={leadTimeTarget}
              cycleTimeTarget={cycleTimeTarget}
              leadTimeConfidenceTarget={leadTimeConfidenceTarget}
              cycleTimeConfidenceTarget={cycleTimeConfidenceTarget}
              includeSubTasks={includeSubTasksFlowMetrics}
              latestCommit={latestCommit}
              latestWorkItemEvent={latestWorkItemEvent}
            />
          )}
          showDetail={false}
        />
        <DashboardWidget
          name="traceability"
          title={"Traceability"}
          className={styles.traceability}
          hideTitlesInDetailView={"true"}
          render={({view}) => (
            <ProjectTraceabilityTrendsWidget
              instanceKey={key}
              measurementWindow={flowAnalysisPeriod}
              days={7}
              samplingFrequency={7}
              context={context}
              view={view}
              latestWorkItemEvent={latestWorkItemEvent}
              latestCommit={latestCommit}
              asStatistic={{title: "Last 30 Days"}}
              primaryStatOnly={true}
              target={0.9}
            />
          )}
          showDetail={true}
        />

      </DashboardRow>

      <DashboardRow h={"42%"}>
        <DashboardWidget
          name="volume-trends"
          className={styles.volumeTrends}
          render={({view}) => (
            <DimensionVolumeTrendsWidget
              dimension={'project'}
              instanceKey={key}
              measurementWindow={flowAnalysisPeriod}
              days={flowAnalysisPeriod}
              samplingFrequency={7}
              targetPercentile={0.7}
              context={context}
              view={view}
              latestCommit={latestCommit}
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
        <DashboardWidget
          name="pipeline-funnel"
          className={styles.pipelineFunnel}
          render={({view}) => (
            <ProjectPipelineFunnelWidget
              instanceKey={key}
              context={context}
              workItemScope={workItemScope}
              setWorkItemScope={setWorkItemScope}
              latestWorkItemEvent={latestWorkItemEvent}
              latestCommit={latestCommit}
              days={flowAnalysisPeriod}
              view={view}
              leadTimeConfidenceTarget={leadTimeConfidenceTarget}
              cycleTimeConfidenceTarget={cycleTimeConfidenceTarget}
              leadTimeTarget={leadTimeTarget}
              cycleTimeTarget={cycleTimeTarget}
              includeSubTasks={{includeSubTasksInClosedState: includeSubTasksFlowMetrics, includeSubTasksInNonClosedState: includeSubTasksWipInspector}}
            />
          )}
          showDetail={false}
        />
        <DashboardWidget
          name="response-time-trends"
          className={styles.responseTimeTrends}
          render={({view}) => (
            <DimensionResponseTimeTrendsWidget
              dimension={'project'}
              instanceKey={key}
              measurementWindow={flowAnalysisPeriod}
              days={flowAnalysisPeriod}
              samplingFrequency={7}
              specsOnly={true}
              leadTimeTarget={leadTimeTarget}
              cycleTimeTarget={cycleTimeTarget}
              leadTimeConfidenceTarget={leadTimeConfidenceTarget}
              cycleTimeConfidenceTarget={cycleTimeConfidenceTarget}
              targetPercentile={cycleTimeConfidenceTarget}
              context={context}
              view={view}
              latestCommit={latestCommit}
              latestWorkItemEvent={latestWorkItemEvent}
              defaultSeries={["all"]}
              includeSubTasks={includeSubTasksFlowMetrics}
            />
          )}
          showDetail={true}
        />
      </DashboardRow>
      <DashboardRow h={"45%"} className={styles.valueRow}>


        <DashboardWidget
          name="project-pipeline-queues"
          className={styles.phaseDetail}
          render={({view}) => (
            <DimensionValueStreamPhaseDetailWidget
              dimension={'project'}
              instanceKey={key}
              context={context}
              funnelView={true}
              specsOnly={specsOnly}
              latestWorkItemEvent={latestWorkItemEvent}
              latestCommit={latestCommit}
              days={flowAnalysisPeriod}
              closedWithinDays={flowAnalysisPeriod}
              view={view}
              leadTimeConfidenceTarget={leadTimeConfidenceTarget}
              cycleTimeConfidenceTarget={cycleTimeConfidenceTarget}
              leadTimeTarget={leadTimeTarget}
              cycleTimeTarget={cycleTimeTarget}
              includeSubTasks={includeSubTasksFlowMetrics}
            />
          )}
          showDetail={true}
        />
      </DashboardRow>
    </Dashboard>
  );
}
export const dashboard = ({viewerContext}) => (
  <ProjectDashboard pollInterval={1000 * 60} render={(props) => <FlowDashboard {...props} />} />
);
export default withViewerContext(dashboard);

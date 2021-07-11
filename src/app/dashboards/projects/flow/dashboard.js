import React, {useState} from "react";
import {Dashboard, DashboardRow, DashboardWidget} from "../../../framework/viz/dashboard";
import {DimensionWipFlowMetricsWidget} from "../../shared/widgets/work_items/wip";
import {DimensionFlowMetricsWidget} from "../../shared/widgets/work_items/closed/flowMetrics";
import {ProjectDefectMetricsWidget} from "../shared/widgets/defectMetrics";
import {ProjectPipelineFunnelWidget} from "../shared/widgets/funnel";
import {ProjectResponseTimeSLAWidget} from "../shared/widgets/responseTimeSLA";
import {withViewerContext} from "../../../framework/viewer/viewerContext";
import {ProjectDashboard} from "../projectDashboard";
import {useProjectWorkItemSourcesStateMappings} from "../shared/hooks/useQueryProjectWorkItemsSourceStateMappings";
import {ProjectTraceabilityTrendsWidget} from "../../shared/widgets/commits/traceability";
import {ProjectFlowMixTrendsWidget} from "../shared/widgets/flowMix";
import {ProjectEffortTrendsWidget} from "../shared/widgets/capacity";
import {StateMappingIndex} from "../shared/stateMappingIndex";
import {Flex} from "reflexbox";
import {WorkItemScopeSelector} from "../shared/components/workItemScopeSelector";
import { DimensionResponseTimeTrendsWidget } from "../../shared/widgets/work_items/trends/responseTime";
import { DimensionVolumeTrendsWidget } from "../../shared/widgets/work_items/trends/volume";
import { DimensionPredictabilityTrendsWidget } from "../../shared/widgets/work_items/trends/predictability";
import styles from "../../projects/flow/dashboard.module.css";
import { DimensionValueStreamPhaseDetailWidget } from "../../shared/widgets/work_items/valueStreamPhaseDetail";

const dashboard_id = "dashboards.activity.projects.newDashboard.instance";



function FlowDashboard({project: {key, latestWorkItemEvent, latestCommit, settings, settingsWithDefaults}, context}) {
  const stateMappingIndex = new StateMappingIndex(useProjectWorkItemSourcesStateMappings(key));
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
    <Dashboard dashboard={`${dashboard_id}`}>
      <DashboardRow h="12%">
        <DashboardWidget
          name="flow-metrics"
          title={"Throughput"}
          w={0.33}
          className={styles.flowMetrics}
          subtitle={`Last ${flowAnalysisPeriod} days`}
          hideTitlesInDetailView={true}
          render={({ view }) => (
            <DimensionFlowMetricsWidget
              dimension={"project"}
              instanceKey={key}
              view={view}
              display={"throughputSummary"}
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
            />
          )}
          showDetail={false}
        />
        <DashboardWidget
          name="pipeline"
          w={0.35}
          className={styles.pipeline}
          title={"Work In Progress"}

          render={({view}) => (
            <DimensionWipFlowMetricsWidget
              dimension={'project'}
              instanceKey={key}
              display={"teamWipSummary"}
              latestCommit={latestCommit}
              latestWorkItemEvent={latestWorkItemEvent}
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
            />
          )}
          showDetail={false}
          hideTitlesInDetailView={true}
        />

        <DashboardWidget
          name="flow-metrics"
          title={"Spec Response Time"}
          w={0.2}
          className={styles.flowMetrics}
          subtitle={`Last ${flowAnalysisPeriod} days`}
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
            />
          )}
          showDetail={false}
        />
        <DashboardWidget
          name="traceability"
          w={0.13}
          title={"Traceability"}
          subtitle={`${flowAnalysisPeriod} Days`}
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
              asStatistic={{title: "Current"}}
              target={0.9}
            />
          )}
          showDetail={false}
        />

      </DashboardRow>

      <DashboardRow h={"45%"}>
        <DashboardWidget
          name="volume-trends"
          w={1/3}
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
              latestWorkItemEvent={latestWorkItemEvent}
              leadTimeTarget={leadTimeTarget}
              cycleTimeTarge={cycleTimeTarget}
              leadTimeConfidenceTarget={leadTimeConfidenceTarget}
              cycleTimeConfidenceTarget={cycleTimeConfidenceTarget}
              includeSubTasks={includeSubTasksFlowMetrics}
            />
          )}
          showDetail={false}
        />
        <DashboardWidget
          name="pipeline-funnel"
          w={1/3}
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
          w={1/3}
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
              latestWorkItemEvent={latestWorkItemEvent}
              defaultSeries={["all"]}
              includeSubTasks={includeSubTasksFlowMetrics}
            />
          )}
          showDetail={false}
        />
      </DashboardRow>
      <DashboardRow h={"45%"}>


        <DashboardWidget
          w={1}
          name="project-pipeline-queues"
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

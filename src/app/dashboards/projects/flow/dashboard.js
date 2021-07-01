import React, {useState} from "react";
import {Dashboard, DashboardRow, DashboardWidget} from "../../../framework/viz/dashboard";
import {ProjectPipelineWidget} from "../shared/widgets/wip";
import {DimensionFlowMetricsWidget} from "../shared/widgets/flowMetrics";
import {ProjectDefectMetricsWidget} from "../shared/widgets/defectMetrics";
import {ProjectPipelineFunnelWidget} from "../shared/widgets/funnel";
import {ProjectResponseTimeSLAWidget} from "../shared/widgets/responseTimeSLA";
import {withViewerContext} from "../../../framework/viewer/viewerContext";
import {ProjectDashboard} from "../projectDashboard";
import {useProjectWorkItemSourcesStateMappings} from "../shared/hooks/useQueryProjectWorkItemsSourceStateMappings";
import {ProjectTraceabilityTrendsWidget} from "../shared/widgets/traceability";
import {ProjectFlowMixTrendsWidget} from "../shared/widgets/flowMix";
import {ProjectEffortTrendsWidget} from "../shared/widgets/capacity";
import {StateMappingIndex} from "../shared/stateMappingIndex";
import {Flex} from "reflexbox";
import styles from "./dashboard.module.css";
import {WorkItemScopeSelector} from "../shared/components/workItemScopeSelector";
import { DimensionResponseTimeTrendsWidget } from "../../shared/widgets/work_items/trends/responseTime";
import { DimensionVolumeTrendsWidget } from "../../shared/widgets/work_items/trends/volume";
import { DimensionPredictabilityTrendsWidget } from "../../shared/widgets/work_items/trends/predictability";

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
    includeSubTasksFlowMetrics,
    includeSubTasksWipInspector
  } = settingsWithDefaults;

  return (
    <Dashboard dashboard={`${dashboard_id}`} className={styles.flowDashboard} gridLayout={true}>
      <DashboardRow h="12%">
        <DashboardWidget
          name="response-time-sla"
          className={styles.leadTime}
          title={"Lead Time"}
          subtitle={`${flowAnalysisPeriod} Days`}
          render={() => (
            <ProjectResponseTimeSLAWidget
              instanceKey={key}
              days={flowAnalysisPeriod}
              metric={"leadTime"}
              leadTimeTarget={leadTimeTarget}
              cycleTimeTarget={cycleTimeTarget}
              cycleTimeConfidenceTarget={cycleTimeConfidenceTarget}
              leadTimeConfidenceTarget={leadTimeConfidenceTarget}
              latestWorkItemEvent={latestWorkItemEvent}
              specsOnly={specsOnly}
              includeSubTasks={includeSubTasksFlowMetrics}
            />
          )}
        />
        {stateMappingIndex.isValid() && (
          <DashboardWidget
            name="defect-metrics"
            className={styles.quality}
            title={"Quality"}
            subtitle={`${flowAnalysisPeriod} Days`}
            hideTitlesInDetailView={true}
            render={({view}) => (
              <ProjectDefectMetricsWidget
                instanceKey={key}
                view={view}
                context={context}
                latestWorkItemEvent={latestWorkItemEvent}
                stateMappingIndex={stateMappingIndex}
                days={flowAnalysisPeriod}
                leadTimeTarget={leadTimeTarget}
                cycleTimeTarget={cycleTimeTarget}
                leadTimeConfidenceTarget={leadTimeConfidenceTarget}
                cycleTimeConfidenceTarget={cycleTimeConfidenceTarget}
              />
            )}
            showDetail={true}
          />
        )}

        <DashboardWidget
          name="alignment"
          className={styles.valueMix}
          title={"Value Mix"}
          subtitle={`${flowAnalysisPeriod} Days`}
          styles={{
            controlContainer: {
              width: "30%",
            },
          }}
          controls={[({view}) => view !== "detail" && <span>{specsOnly ? "% of EffortOUT" : "% of Volume"}</span>]}
          render={({view}) => (
            <ProjectFlowMixTrendsWidget
              instanceKey={key}
              measurementWindow={flowAnalysisPeriod}
              days={7}
              samplingFrequency={7}
              context={context}
              view={view}
              latestWorkItemEvent={latestWorkItemEvent}
              latestCommit={latestCommit}
              specsOnly={specsOnly}
              asStatistic={true}
              includeSubTasks={includeSubTasksFlowMetrics}
            />
          )}
          hideTitlesInDetailView={true}
          showDetail={true}
        />

        <DashboardWidget
          name="team"
          className={styles.team}
          title={"Team"}
          subtitle={`${flowAnalysisPeriod} Days`}
          render={({view}) => (
            <ProjectEffortTrendsWidget
              instanceKey={key}
              measurementWindow={flowAnalysisPeriod}
              days={7}
              samplingFrequency={7}
              context={context}
              view={view}
              latestWorkItemEvent={latestWorkItemEvent}
              latestCommit={latestCommit}
              asStatistic={true}
              target={0.9}
              includeSubTasks={includeSubTasksFlowMetrics}
            />
          )}
          showDetail={true}
          hideTitlesInDetailView={true}
        />
        <DashboardWidget
          name="traceability"
          className={styles.traceability}
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
          showDetail={true}
        />
      </DashboardRow>

      <DashboardRow h={"28%"} title={"Flow"} className={styles.flowRow}>
        {stateMappingIndex.isValid() && (
          <DashboardWidget
            name="flow-metrics"
            className={styles.closed}
            title={`Closed `}
            subtitle={`Last ${flowAnalysisPeriod} Days`}
            hideTitlesInDetailView={true}
            render={({view}) => (
              <DimensionFlowMetricsWidget
                dimension={'project'}
                instanceKey={key}
                view={view}
                display={"valueBoardSummary"}
                twoRows={true}
                context={context}
                specsOnly={specsOnly}
                latestWorkItemEvent={latestWorkItemEvent}
                stateMappingIndex={stateMappingIndex}
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
            showDetail={true}
          />
        )}
        <DashboardWidget
          name="pipeline-funnel"
          className={styles.funnel}
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
          showDetail={true}
        />
        {stateMappingIndex.isValid() && (
          <DashboardWidget
            name="wip"
            className={styles.wip}
            title={"Work In Progress"}
            render={({view}) => (
              <ProjectPipelineWidget
                instanceKey={key}
                display={"valueBoardSummary"}
                specsOnly={specsOnly}
                latestCommit={latestCommit}
                latestWorkItemEvent={latestWorkItemEvent}
                stateMappingIndex={stateMappingIndex}
                days={flowAnalysisPeriod}
                targetPercentile={responseTimeConfidenceTarget}
                leadTimeTargetPercentile={leadTimeConfidenceTarget}
                cycleTimeTargetPercentile={cycleTimeConfidenceTarget}
                view={view}
                context={context}
                includeSubTasks={includeSubTasksWipInspector}
              />
            )}
            showDetail={true}
            hideTitlesInDetailView={true}
          />
        )}
      </DashboardRow>
      <div className={styles.scopeSelector}>
        <Flex w={1} justify={"center"}>
          <WorkItemScopeSelector workItemScope={workItemScope} setWorkItemScope={setWorkItemScope} />
        </Flex>
      </div>
      <DashboardRow h={"49%"} title={"Trends"} className={styles.valueRow}>
        <DashboardWidget
          name="volume-trends"
          className={styles.valueBookClosed}
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
          showDetail={true}
        />
        <DashboardWidget
          name="response-time-trends"
          className={styles.valueMixChart}
          render={({view}) => (
            <DimensionResponseTimeTrendsWidget
              dimension={'project'}
              instanceKey={key}
              measurementWindow={flowAnalysisPeriod}
              days={flowAnalysisPeriod}
              samplingFrequency={7}
              specsOnly={specsOnly}
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
          showDetail={true}
        />
        <DashboardWidget
          name="predictability-trends"
          className={styles.valueBookWip}
          render={({view}) => (
            <DimensionPredictabilityTrendsWidget
              dimension={'project'}
              instanceKey={key}
              measurementWindow={flowAnalysisPeriod}
              days={flowAnalysisPeriod}
              specsOnly={specsOnly}
              samplingFrequency={7}
              cycleTimeTarget={cycleTimeTarget}
              leadTimeTarget={leadTimeTarget}
              cycleTimeConfidenceTarget={cycleTimeConfidenceTarget}
              leadTimeConfidenceTarget={leadTimeConfidenceTarget}
              targetPercentile={cycleTimeConfidenceTarget}
              context={context}
              view={view}
              latestWorkItemEvent={latestWorkItemEvent}
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

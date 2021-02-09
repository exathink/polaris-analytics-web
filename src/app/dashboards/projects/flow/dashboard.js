import React, {useState} from "react";
import {Dashboard, DashboardRow, DashboardWidget} from "../../../framework/viz/dashboard";
import {ProjectPipelineWidget} from "../shared/widgets/wip";
import {ProjectFlowMetricsWidget} from "../shared/widgets/flowMetrics";
import {ProjectDefectMetricsWidget} from "../shared/widgets/defectMetrics";
import {ProjectPipelineFunnelWidget} from "../shared/widgets/funnel";
import {ProjectResponseTimeSLAWidget} from "../shared/widgets/responseTimeSLA";
import {withViewerContext} from "../../../framework/viewer/viewerContext";
import {ProjectDashboard} from "../projectDashboard";
import {useProjectWorkItemSourcesStateMappings} from "../shared/hooks/useQueryProjectWorkItemsSourceStateMappings";
import {ProjectTraceabilityTrendsWidget} from "../shared/widgets/traceability";
import {ProjectFlowMixTrendsWidget} from "../shared/widgets/flowMix";
import {ProjectEffortTrendsWidget} from "../shared/widgets/capacity";
import {ProjectImplementationCostWidget} from "../shared/widgets/implementationCost";
import {StateMappingIndex} from "../shared/stateMappingIndex";

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
  } = settingsWithDefaults;

  return (
    <Dashboard dashboard={`${dashboard_id}`}>
      <DashboardRow h="12%">
        <DashboardWidget
          w={0.2}
          name="response-time-sla"
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
            />
          )}
        />
        {stateMappingIndex.isValid() && (
          <DashboardWidget
            w={0.19}
            name="defect-metrics"
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
          w={0.37}
          name="alignment"
          title={"Flow Types"}
          subtitle={`${flowAnalysisPeriod} Days`}
          styles={{
            controlContainer: {
              width: "27%",
            },
          }}
          controls={[({view}) => view !== "detail" && <span>{specsOnly ? "% of Capacity" : "% of Volume"}</span>]}
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
            />
          )}
          hideTitlesInDetailView={true}
          showDetail={true}
        />

        <DashboardWidget
          w={0.2}
          name="team"
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
            />
          )}
          showDetail={true}
          hideTitlesInDetailView={true}
        />
        <DashboardWidget
          w={0.13}
          name="traceability"
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

      <DashboardRow h={"28%"} title={"Flow Metrics"}>
        {stateMappingIndex.isValid() && (
          <DashboardWidget
            w={0.34}
            name="flow-metrics"
            title={`Closed `}
            subtitle={`Last ${flowAnalysisPeriod} Days`}
            hideTitlesInDetailView={true}
            render={({view}) => (
              <ProjectFlowMetricsWidget
                instanceKey={key}
                view={view}
                display={"valueBoardSummary"}
                twoRows={true}
                context={context}
                specsOnly={specsOnly}
                latestWorkItemEvent={latestWorkItemEvent}
                stateMappingIndex={stateMappingIndex}
                days={flowAnalysisPeriod}
                measurementWindow={30}
                targetPercentile={responseTimeConfidenceTarget}
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
          w={0.36}
          name="pipeline-funnel"
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
            />
          )}
          showDetail={true}
        />
        {stateMappingIndex.isValid() && (
          <DashboardWidget
            w={0.29}
            name="wip"
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
              />
            )}
            showDetail={true}
            hideTitlesInDetailView={true}
          />
        )}
      </DashboardRow>

      <DashboardRow h={"49%"} title={"Flow Mix"}>
        <DashboardWidget
          w={0.34}
          name="epic-flow-mix-closed"
          render={({view}) => (
            <ProjectImplementationCostWidget
              instanceKey={key}
              days={flowAnalysisPeriod}
              specsOnly={specsOnly}
              view={view}
              latestCommit={latestCommit}
              latestWorkItemEvent={latestWorkItemEvent}
            />
          )}
          showDetail={true}
        />
        <DashboardWidget
          w={0.36}
          name="flow-type-flow-mix"
          render={({view}) => (
            <ProjectFlowMixTrendsWidget
              instanceKey={key}
              measurementWindow={7}
              days={flowAnalysisPeriod}
              samplingFrequency={7}
              context={context}
              view={view}
              latestWorkItemEvent={latestWorkItemEvent}
              latestCommit={latestCommit}
              specsOnly={specsOnly}
              showCounts={true}
              chartOptions={{alignTitle: "left"}}
            />
          )}
          showDetail={true}
        />
        <DashboardWidget
          w={0.29}
          name="epic-flow-mix-wip"
          render={({view}) => (
            <ProjectImplementationCostWidget
              instanceKey={key}
              specsOnly={specsOnly}
              activeOnly={true}
              view={view}
              latestCommit={latestCommit}
              latestWorkItemEvent={latestWorkItemEvent}
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

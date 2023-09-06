import React from "react";
import { ProjectDashboard, useProjectContext } from "../projectDashboard";
import { withViewerContext } from "../../../framework/viewer/viewerContext";
import { Dashboard, DashboardRow, DashboardWidget } from "../../../framework/viz/dashboard";
import { ProjectValueBookWidget } from "../../shared/widgets/work_items/valueBook";
import styles from "./dashboard.module.css";
import { DimensionFlowMixTrendsWidget } from "../../shared/widgets/work_items/trends/flowMix";
import { Flex } from "reflexbox";
import { WorkItemScopeSelector } from "../../shared/components/workItemScopeSelector/workItemScopeSelector";
import { DimensionWipFlowMetricsWidget } from "../../shared/widgets/work_items/wip";
import { DaysRangeSlider, SIX_MONTHS } from "../../shared/components/daysRangeSlider/daysRangeSlider";
import { DimensionThroughputWidget } from "../../shared/widgets/work_items/throughput/dimensionThroughputWidget";
import { AppTerms } from "../../shared/config";

const dashboard_id = "dashboards.value.projects.dashboard.instance";

function ValueDashboard({
  context,
  viewerContext,
}) {
  const {key, latestWorkItemEvent, latestCommit, settingsWithDefaults} = useProjectContext((result) => result.project);
  const {
    flowAnalysisPeriod,
    includeSubTasksFlowMetrics,
    includeSubTasksWipInspector,
    leadTimeConfidenceTarget,
    cycleTimeConfidenceTarget,
    leadTimeTarget,
    cycleTimeTarget,
    responseTimeConfidenceTarget,
    wipLimit
  } = settingsWithDefaults;

  const [workItemScope, setWorkItemScope] = React.useState("specs");
  const specsOnly = workItemScope === "specs";
  const [closedWithinDays, setClosedWithinDays] = React.useState(flowAnalysisPeriod);
  return (
    <Dashboard dashboard={`${dashboard_id}`} className={styles.valueDashboard} gridLayout={true}>
      <div className={styles.rangeSlider}>
              <DaysRangeSlider initialDays={closedWithinDays} setDaysRange={setClosedWithinDays} range={SIX_MONTHS} />
      </div>
      <div className={styles.scopeSelector}>
        <Flex w={1} justify={"center"}>
          <WorkItemScopeSelector label={"Show by"} display={['Capacity', 'Volume']} workItemScope={workItemScope} setWorkItemScope={setWorkItemScope} />
        </Flex>
      </div>
      <DashboardRow
        h={"15%"}
      >
        <DashboardWidget
          name="flow-metrics"
          title={"Throughput"}
          className={styles.throughput}
          subtitle={`${specsOnly ? AppTerms.specs.display : `All ${AppTerms.cards.display}`}, Last ${flowAnalysisPeriod} days`}
          hideTitlesInDetailView={true}
          render={({ view }) => (
            <DimensionThroughputWidget
              dimension={"project"}
              instanceKey={key}
              view={view}
              display={"throughputSummary"}
              context={context}
              specsOnly={specsOnly}
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
              normalized={false}
            />
          )}
          showDetail={false}
        />
        <DashboardWidget
          name="flow-type-flow-mix"
          title={`${specsOnly ? 'Capacity Allocation' : 'Flow Mix'}`}
          subtitle={`Last ${flowAnalysisPeriod} Days`}
          className={styles.valueMix}
          render={({view}) => (
            <DimensionFlowMixTrendsWidget
              dimension={'project'}
              instanceKey={key}
              measurementWindow={flowAnalysisPeriod}
              days={flowAnalysisPeriod}
              samplingFrequency={flowAnalysisPeriod}
              context={context}
              view={view}
              latestWorkItemEvent={latestWorkItemEvent}
              latestCommit={latestCommit}
              specsOnly={specsOnly}
              showCounts={true}
              asStatistic={true}
              asCard={false}
              includeSubTasks={includeSubTasksFlowMetrics}
            />
          )}
          showDetail={true}
          hideTitlesInDetailView={true}
        />
        <DashboardWidget
          name="pipeline"
          className={styles.workInProgress}
          title={"Work In Process"}
          subtitle={`${specsOnly ? AppTerms.specs.display : `All ${AppTerms.cards.display}`}`}

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
              specsOnly={specsOnly}
              context={context}
              includeSubTasks={includeSubTasksWipInspector}
              latestCommit={latestCommit}
              latestWorkItemEvent={latestWorkItemEvent}
            />
          )}
          showDetail={false}
          hideTitlesInDetailView={true}
        />
      </DashboardRow>
      <DashboardRow h={"100%"}>
        <DashboardWidget
          name="epic-flow-mix-closed"
          className={styles.valueBookClosed}
          render={({view}) => (
            <ProjectValueBookWidget
              instanceKey={key}
              context={context}
              days={closedWithinDays}
              specsOnly={specsOnly}
              view={view}
              latestCommit={latestCommit}
              latestWorkItemEvent={latestWorkItemEvent}
              includeSubTasks={includeSubTasksFlowMetrics}
              workItemScope={workItemScope}
              setWorkItemScope={setWorkItemScope}
              setClosedWithinDays={setClosedWithinDays}
            />
          )}
          showDetail={true}
        />

      </DashboardRow>
    </Dashboard>
  );
}

const dashboard = ({viewerContext, intl}) => (
  <ProjectDashboard pollInterval={1000 * 60}>
    <ValueDashboard viewerContext={viewerContext} intl={intl} />
  </ProjectDashboard>
);
export default withViewerContext(dashboard);

import React, { useState } from "react";
import { Dashboard, DashboardRow, DashboardWidget } from "../../../framework/viz/dashboard";
import { WorkItemStateTypes } from "../../shared/config";
import styles from "./dashboard.module.css";

import { withViewerContext } from "../../../framework/viewer/viewerContext";

import { ProjectDashboard } from "../projectDashboard";
import {
  DimensionPipelineCycleTimeLatencyWidget,
} from "../../shared/widgets/work_items/wip";
import {Flex} from "reflexbox";
import {WorkItemScopeSelector} from "../../shared/components/workItemScopeSelector/workItemScopeSelector";
import {SYSTEM_TEAMS} from "../../../../config/featureFlags";
import { DimensionWipMetricsWidget } from "../../shared/widgets/work_items/wip/flowMetrics/dimensionWipMetricsWidget";

const dashboard_id = "dashboards.activity.projects.newDashboard.instance";

WipDashboard.videoConfig = {
  url: "https://vimeo.com/501974487/080d487fcf",
  title: "WIP Dashboard",
  VideoDescription: () => (
    <>
      <h2>Wip Dashboard</h2>
      <p> lorem ipsum Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
    </>
  ),
};

function WipDashboard({
  project: {key, latestWorkItemEvent, latestCommit, latestPullRequestEvent, settings, settingsWithDefaults},
  context,
  viewerContext
}) {

  const [workItemScope, setWorkItemScope] = useState("specs");
  const specsOnly = workItemScope === "specs";
  const teamsActive = viewerContext.isFeatureFlagActive(SYSTEM_TEAMS)
  const {
    cycleTimeTarget,
    responseTimeConfidenceTarget,
    leadTimeConfidenceTarget,
    cycleTimeConfidenceTarget,
    wipLimit,
    wipAnalysisPeriod,
    includeSubTasksWipInspector,
    latencyTarget
  } = settingsWithDefaults;

  return (
    <Dashboard dashboard={`${dashboard_id}`} dashboardVideoConfig={WipDashboard.videoConfig} className={styles.wipDashboard} gridLayout={true}>
      <div className={styles.scopeSelector}>
        <Flex w={1} justify={"center"}>
          <WorkItemScopeSelector workItemScope={workItemScope} setWorkItemScope={setWorkItemScope} />
        </Flex>
      </div>
      <DashboardRow h="12%">

        <DashboardWidget
          name="pipeline"
          className={styles.pipeline}
          title={""}
          render={({view}) => (
            <DimensionWipMetricsWidget
              dimension={'project'}
              instanceKey={key}
              display={"wipSummary"}
              latestCommit={latestCommit}
              latestWorkItemEvent={latestWorkItemEvent}
              latestPullRequestEvent={latestPullRequestEvent}
              days={wipAnalysisPeriod}
              targetPercentile={responseTimeConfidenceTarget}
              leadTimeTargetPercentile={leadTimeConfidenceTarget}
              cycleTimeTargetPercentile={cycleTimeConfidenceTarget}
              cycleTimeTarget={cycleTimeTarget}
              wipLimit={wipLimit}
              view={view}
              specsOnly={specsOnly}
              context={context}
              includeSubTasks={includeSubTasksWipInspector}
            />
          )}
          showDetail={false}
          hideTitlesInDetailView={true}
        />



      </DashboardRow>
      <DashboardRow h="36%" title={" "}>
        <DashboardWidget
          name="engineering"
          className={styles.engineering}
          render={({view}) => (
            <DimensionPipelineCycleTimeLatencyWidget
              dimension={"project"}
              instanceKey={key}
              view={view}
              tooltipType="small"
              stageName={"Coding"}
              stateTypes={[WorkItemStateTypes.open, WorkItemStateTypes.make]}
              groupByState={true}
              cycleTimeTarget={cycleTimeTarget}
              latencyTarget={latencyTarget}
              specsOnly={specsOnly}
              workItemScope={workItemScope}
              setWorkItemScope={setWorkItemScope}
              context={context}
              latestWorkItemEvent={latestWorkItemEvent}
              latestCommit={latestCommit}
              targetPercentile={cycleTimeConfidenceTarget}
              includeSubTasks={includeSubTasksWipInspector}
            />
          )}
          showDetail={true}
        />

        <DashboardWidget
          name="delivery"
          className={styles.delivery}
          render={({view}) => (
            <DimensionPipelineCycleTimeLatencyWidget
              dimension={"project"}
              instanceKey={key}
              view={view}
              tooltipType="small"
              stageName={"Delivery"}
              stateTypes={[WorkItemStateTypes.deliver]}
              groupByState={true}
              cycleTimeTarget={cycleTimeTarget}
              latencyTarget={latencyTarget}
              context={context}
              latestWorkItemEvent={latestWorkItemEvent}
              latestCommit={latestCommit}
              targetPercentile={cycleTimeConfidenceTarget}
              specsOnly={specsOnly}
              workItemScope={workItemScope}
              setWorkItemScope={setWorkItemScope}
              includeSubTasks={includeSubTasksWipInspector}
            />
          )}
          showDetail={true}
        />
      </DashboardRow>
      
    </Dashboard>
  );
}
export const dashboard = ({viewerContext}) => <ProjectDashboard pollInterval={1000 * 60} render={props => <WipDashboard viewerContext={viewerContext}  {...props}/>} />;
export default withViewerContext(dashboard);

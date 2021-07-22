import React from "react";
import {ProjectDashboard} from "../projectDashboard";
import {withViewerContext} from "../../../framework/viewer/viewerContext";
import {Dashboard, DashboardRow, DashboardWidget} from "../../../framework/viz/dashboard";
import {ProjectValueBookWidget} from "../../shared/widgets/work_items/valueBook";
import styles from "./dashboard.module.css";
import {DimensionFlowMixTrendsWidget} from "../../shared/widgets/work_items/trends/flowMix";
import {Flex} from "reflexbox";
import {WorkItemScopeSelector} from "../../shared/components/workItemScopeSelector/workItemScopeSelector";

const dashboard_id = "dashboards.value.projects.dashboard.instance";

function ValueDashboard({
  project: {key, latestWorkItemEvent, latestCommit, settingsWithDefaults},
  context,
  viewerContext,
}) {
  const {flowAnalysisPeriod, includeSubTasksFlowMetrics, includeSubTasksWipInspector} = settingsWithDefaults;

  const [workItemScope, setWorkItemScope] = React.useState("all");
  const specsOnly = workItemScope === "specs";
  const [closedWithinDays, setClosedWithinDays] = React.useState(flowAnalysisPeriod);
  return (
    <Dashboard dashboard={`${dashboard_id}`} className={styles.valueDashboard} gridLayout={true}>
      <DashboardRow h={"50%"}>
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
          showDetail={false}
        />
        <DashboardWidget
          name="flow-type-flow-mix"
          className={styles.valueMixChart}
          render={({view}) => (
            <DimensionFlowMixTrendsWidget
              dimension={'project'}
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
              includeSubTasks={includeSubTasksFlowMetrics}
            />
          )}
          showDetail={true}
        />
        <DashboardWidget
          name="epic-flow-mix-wip"
          className={styles.valueBookWip}
          render={({view}) => (
            <ProjectValueBookWidget
              instanceKey={key}
              context={context}
              specsOnly={specsOnly}
              activeOnly={true}
              view={view}
              latestCommit={latestCommit}
              latestWorkItemEvent={latestWorkItemEvent}
              includeSubTasks={includeSubTasksWipInspector}
              workItemScope={workItemScope}
              setWorkItemScope={setWorkItemScope}
            />
          )}
          showDetail={false}
        />
      </DashboardRow>
      <div className={styles.scopeSelector}>
        <Flex w={1} justify={"center"}>
          <WorkItemScopeSelector workItemScope={workItemScope} setWorkItemScope={setWorkItemScope} />
        </Flex>
      </div>
    </Dashboard>
  );
}

const dashboard = ({viewerContext, intl}) => (
  <ProjectDashboard
    pollInterval={1000 * 60}
    render={(props) => <ValueDashboard {...props} viewerContext={viewerContext} intl={intl} />}
  />
);
export default withViewerContext(dashboard);

import React from "react";
import {ProjectDashboard} from "../projectDashboard";
import {withViewerContext} from "../../../framework/viewer/viewerContext";
import {Dashboard, DashboardRow, DashboardWidget} from "../../../framework/viz/dashboard";
import {ProjectImplementationCostWidget} from "../shared/widgets/implementationCost";
import styles from "./dashboard.module.css";
import {ProjectFlowMixTrendsWidget} from "../shared/widgets/flowMix";
import {DaysRangeSlider, ONE_YEAR} from "../../shared/components/daysRangeSlider/daysRangeSlider";

const dashboard_id = "dashboards.value.projects.dashboard.instance";

function ValueDashboard({
  project: {key, latestWorkItemEvent, latestCommit, settingsWithDefaults},
  context,
  viewerContext,
}) {
  const {flowAnalysisPeriod, includeSubTasksFlowMetrics} = settingsWithDefaults;

  const specsOnly = true;
  const [activeWithinDays, setActiveWithinDays] = React.useState(flowAnalysisPeriod);

  return (
    <Dashboard dashboard={`${dashboard_id}`} className={styles.valueDashboard} gridLayout={true}>
      <DashboardRow
        h={"50%"}
        title={""}
        className={styles.valueRow}
        controls={[
          () => (
            <div style={{minWidth: "500px"}}>
              <DaysRangeSlider
                title={"Days"}
                initialDays={activeWithinDays}
                setDaysRange={setActiveWithinDays}
                range={ONE_YEAR}
              />
            </div>
          ),
        ]}
      >
        <DashboardWidget
          name="epic-flow-mix-closed"
          className={styles.valueBookClosed}
          render={({view}) => (
            <ProjectImplementationCostWidget
              instanceKey={key}
              context={context}
              days={activeWithinDays}
              specsOnly={specsOnly}
              view={view}
              latestCommit={latestCommit}
              latestWorkItemEvent={latestWorkItemEvent}
              includeSubTasks={includeSubTasksFlowMetrics}
            />
          )}
          showDetail={true}
        />
        <DashboardWidget
          name="flow-type-flow-mix"
          className={styles.valueMixChart}
          render={({view}) => (
            <ProjectFlowMixTrendsWidget
              instanceKey={key}
              measurementWindow={7}
              days={activeWithinDays}
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
            <ProjectImplementationCostWidget
              instanceKey={key}
              context={context}
              specsOnly={specsOnly}
              activeOnly={true}
              view={view}
              latestCommit={latestCommit}
              latestWorkItemEvent={latestWorkItemEvent}
              includeSubTasks={includeSubTasksWipInspector}
            />
          )}
          showDetail={true}
        />
      </DashboardRow>
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

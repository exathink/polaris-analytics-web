import React, {useState} from "react";
import {Dashboard, DashboardRow, DashboardWidget} from "../../../framework/viz/dashboard";
import {withViewerContext} from "../../../framework/viewer/viewerContext";
import {ProjectDashboard} from "../projectDashboard";
import {ThroughputCardWidget} from "../shared/widgets/throughput/throughputCardWidget";

const dashboard_id = "dashboards.activity.projects.newFlow.instance";

function NewFlowDashboard({
  project: {key, latestWorkItemEvent, latestCommit, settings, settingsWithDefaults},
  context,
}) {
  const [workItemScope] = useState("all");
  const specsOnly = workItemScope === "specs";

  const {
    responseTimeConfidenceTarget,
    flowAnalysisPeriod,
    trendAnalysisPeriod,
    includeSubTasksFlowMetrics,
  } = settingsWithDefaults;

  return (
    <Dashboard dashboard={`${dashboard_id}`} className="tw-grid tw-gap-2 tw-grid-cols-5 tw-grid-rows-3" gridLayout={true}>
      <DashboardRow>
        <DashboardWidget
          name="first-widget"
          title=""
          className="tw-ml-2 tw-mt-2"
          render={({view}) => {
            return (
              <ThroughputCardWidget
                dimension="project"
                instanceKey={key}
                displayType="cardAdvanced"
                trendAnalysisPeriod={trendAnalysisPeriod}
                flowAnalysisPeriod={flowAnalysisPeriod}
                specsOnly={specsOnly}
                latestCommit={latestCommit}
                latestWorkItemEvent={latestWorkItemEvent}
                includeSubTasks={includeSubTasksFlowMetrics}
                targetPercentile={responseTimeConfidenceTarget}
                view={view}
              />
            );
          }}
          showDetail={false}
        />
      </DashboardRow>
    </Dashboard>
  );
}
export const dashboard = ({viewerContext}) => (
  <ProjectDashboard pollInterval={1000 * 60} render={(props) => <NewFlowDashboard {...props} />} />
);
export default withViewerContext(dashboard);

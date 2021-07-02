import React, { useState } from "react";
import {FormattedMessage} from "react-intl.macro";
import {Dashboard, DashboardRow, DashboardWidget} from "../../../framework/viz/dashboard";
import {TeamDashboard} from "../teamDashboard";
import {DimensionFlowMetricsWidget} from "../../shared/widgets/work_items/closed/flowMetrics";
import { withViewerContext } from "../../../framework/viewer/viewerContext";

const dashboard_id = "dashboards.activity.teams.instance";
const messages = {
  topRowTitle: <FormattedMessage id={`${dashboard_id}.topRowTitle`} defaultMessage="Activity Overview" />,
};

function WipDashboard({
  team: {key, latestWorkItemEvent, latestCommit, latestPullRequestEvent, settings, settingsWithDefaults},
  context,
  viewerContext
}) {
  const [workItemScope, setWorkItemScope] = useState("all");
  const specsOnly = workItemScope === "specs";
  return (
    <TeamDashboard
      pollInterval={60 * 1000}
      render={({team, context}) => {
        const {
          leadTimeTarget,
          cycleTimeTarget,
          responseTimeConfidenceTarget,
          leadTimeConfidenceTarget,
          cycleTimeConfidenceTarget,
          wipLimit,
          wipAnalysisPeriod,
          includeSubTasksWipInspector,
          includeSubTasksFlowMetrics,
          latencyTarget,
        } = settingsWithDefaults;
        return (
          <Dashboard dashboard={`${dashboard_id}`}>
            <DashboardRow h="15%">
              <DashboardWidget
                name="flow-metrics"
                title={"Flow"}
                w={1/3}
                subtitle={`Last ${wipAnalysisPeriod} days`}
                hideTitlesInDetailView={true}
                render={({view}) => (
                  <DimensionFlowMetricsWidget
                    dimension={"team"}
                    instanceKey={key}
                    view={view}
                    display={"performanceSummary"}
                    context={context}
                    specsOnly={specsOnly}
                    days={wipAnalysisPeriod}
                    measurementWindow={wipAnalysisPeriod}
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
            </DashboardRow>
          </Dashboard>
        );
      }}
    />
  );
};
export const dashboard = ({viewerContext}) => <TeamDashboard pollInterval={1000 * 60} render={props => <WipDashboard viewerContext={viewerContext}  {...props}/>} />;
export default withViewerContext(dashboard);

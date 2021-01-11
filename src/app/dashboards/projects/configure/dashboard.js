import React from "react";
import {withViewerContext} from "../../../framework/viewer/viewerContext";
import {ProjectDashboard} from "../projectDashboard";
import {Dashboard, DashboardRow, DashboardWidget} from "../../../framework/viz/dashboard";
import {ConfigSelector} from "../shared/components/configSelector";
import {ProjectFlowMetricsSettingWidget} from "../shared/widgets/updateProjectSettings/projectFlowMetricsSettingWidget";
import {ProjectPipelineFunnelWidget} from "../shared/widgets/funnel/projectPipelineFunnelWidget";
import {WorkItemStateTypeMapWidget} from "../shared/widgets/workItemStateTypeMap";
import {CONFIG_TABS} from "./constants";
const dashboard_id = "dashboards.project.configure";

function ConfigureDashboard({project: {key, latestWorkItemEvent, latestCommit, settingsWithDefaults}, context}) {
  const [configTab, setConfigTab] = React.useState(CONFIG_TABS.VALUE_STREAM);
  const {leadTimeTarget, cycleTimeTarget, leadTimeConfidenceTarget, cycleTimeConfidenceTarget} = settingsWithDefaults;

  function getValueStreamElements() {
    if (configTab === CONFIG_TABS.VALUE_STREAM) {
      return (
        <DashboardRow h={"50%"} title={" "}>
          <DashboardWidget
            w={1 / 3}
            name="project-pipeline-detailed"
            render={({view}) => (
              <ProjectPipelineFunnelWidget
                instanceKey={key}
                context={context}
                workItemScope={"all"}
                latestWorkItemEvent={latestWorkItemEvent}
                latestCommit={latestCommit}
                days={30}
                view={view}
              />
            )}
            showDetail={false}
          />
          <DashboardWidget
            w={2 / 3}
            name="workitem-statetype-map"
            render={({view}) => {
              return (
                <WorkItemStateTypeMapWidget
                  instanceKey={key}
                  context={context}
                  latestWorkItemEvent={latestWorkItemEvent}
                  latestCommit={latestCommit}
                  days={30}
                  view={view}
                />
              );
            }}
          />
        </DashboardRow>
      );
    }
  }

  function getFlowMetricsSettingElements() {
    if (configTab === CONFIG_TABS.FLOW_METRICS) {
      return (
        <DashboardRow h="90%">
          <DashboardWidget
            w={1}
            name="flow-metrics-setting-widget"
            render={({view}) => {
              return (
                <ProjectFlowMetricsSettingWidget
                  instanceKey={key}
                  view={view}
                  context={context}
                  latestWorkItemEvent={latestWorkItemEvent}
                  days={90}
                  leadTimeTarget={leadTimeTarget}
                  cycleTimeTarget={cycleTimeTarget}
                  leadTimeConfidenceTarget={leadTimeConfidenceTarget}
                  cycleTimeConfidenceTarget={cycleTimeConfidenceTarget}
                  specsOnly={false}
                />
              );
            }}
            showDetail={false}
          />
        </DashboardRow>
      );
    }
  }

  return (
    <Dashboard dashboard={`${dashboard_id}`}>
      <DashboardRow
        h={"5%"}
        title={""}
        controls={[() => <ConfigSelector configTab={configTab} setConfigTab={setConfigTab} />]}
      ></DashboardRow>
      {getValueStreamElements()}
      {getFlowMetricsSettingElements()}
    </Dashboard>
  );
}

export const dashboard = ({viewerContext}) => {
  return (
    <ProjectDashboard
      pollInterval={1000 * 60}
      render={(props) => {
        return <ConfigureDashboard {...props} />;
      }}
    />
  );
};

export default withViewerContext(dashboard);

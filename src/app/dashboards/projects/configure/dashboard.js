import React from "react";
import {withViewerContext} from "../../../framework/viewer/viewerContext";
import {ProjectDashboard} from "../projectDashboard";
import {Dashboard, DashboardRow, DashboardWidget} from "../../../framework/viz/dashboard";
import {ConfigSelector, CONFIG_TABS} from "./configSelector/configSelector";
import {ProjectResponseTimeSLASettingsWidget} from "./projectResponseTimeSLASettings";
import {ProjectPipelineFunnelWidget} from "../shared/widgets/funnel";
import {WorkItemStateTypeMapWidget} from "../shared/widgets/workItemStateTypeMap";

const dashboard_id = "dashboards.project.configure";

export function ValueStreamMappingDashboard() {
  return (
    <ProjectDashboard
      render={({project: {key}, context}) => {
        return (
        <Dashboard>
          <DashboardRow h={"50%"} title={" "}>
            <DashboardWidget
              w={1 / 3}
              name="project-pipeline-detailed"
              render={({view}) => (
                <ProjectPipelineFunnelWidget
                  instanceKey={key}
                  context={context}
                  workItemScope={"all"}
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
                return <WorkItemStateTypeMapWidget instanceKey={key} context={context} days={30} view={view} />;
              }}
            />
          </DashboardRow>
        </Dashboard>
        )
      }}
    />
  );
}

export function ResponseTimeSLASettingsDashboard() {
  return (
    <ProjectDashboard
      render={({project: {key, settingsWithDefaults}, context}) => {
        const {leadTimeTarget, cycleTimeTarget, leadTimeConfidenceTarget, cycleTimeConfidenceTarget} = settingsWithDefaults;
        return (
        <Dashboard>
          <DashboardRow h="94%">
            <DashboardWidget
              w={1}
              name="flow-metrics-setting-widget"
              render={({view}) => {
                return (
                  <ProjectResponseTimeSLASettingsWidget
                    instanceKey={key}
                    view={view}
                    context={context}
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
        </Dashboard>
        );
      }}
    />
  );
}

export default withViewerContext(({viewerContext}) => {
  const [configTab, setConfigTab] = React.useState(CONFIG_TABS.VALUE_STREAM);

  return (
    <Dashboard dashboard={`${dashboard_id}`}>
      <DashboardRow
        h={"100%"}
        title={""}
        controls={[() => <ConfigSelector configTab={configTab} setConfigTab={setConfigTab} />]}
      >
        {configTab === CONFIG_TABS.VALUE_STREAM ? (
          <ValueStreamMappingDashboard/>
        ) : configTab === CONFIG_TABS.RESPONSE_TIME_SLA ? (
          <ResponseTimeSLASettingsDashboard/>
        ) : null}
      </DashboardRow>
    </Dashboard>
  );
});


import React from "react";
import {withViewerContext} from "../../../framework/viewer/viewerContext";
import {Dashboard, DashboardRow, DashboardWidget} from "../../../framework/viz/dashboard";
import {ProjectDashboard} from "../projectDashboard";
import {ConfigSelector} from "../shared/components/configSelector";
import {ProjectPipelineFunnelWidget} from "../shared/widgets/funnel/projectPipelineFunnelWidget";
import {WorkItemStateTypeMapWidget} from "../shared/widgets/workItemStateTypeMap";

const dashboard_id = "dashboards.project.configure";

export const dashboard = ({viewerContext}) => {
  const [configTab, setConfigTab] = React.useState("value-stream");

  function getValueStreamElements({instanceKey, latestWorkItemEvent, latestCommit, days, context}) {
    return (
      <>
        <DashboardWidget
          w={1 / 3}
          name="project-pipeline-detailed"
          render={({view}) => (
            <ProjectPipelineFunnelWidget
              instanceKey={instanceKey}
              context={context}
              workItemScope={"all"}
              latestWorkItemEvent={latestWorkItemEvent}
              latestCommit={latestCommit}
              days={days}
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
                instanceKey={instanceKey}
                context={context}
                latestWorkItemEvent={latestWorkItemEvent}
                latestCommit={latestCommit}
                days={days}
                view={view}
              />
            );
          }}
        />
      </>
    );
  }

  function getFlowMetricsSettingElements() {
    return (
      <DashboardWidget
        w={1}
        name="flow-metrics-widget"
        render={({view}) => {
          return <div>Flow Metrics Settings</div>;
        }}
      />
    );
  }

  return (
    <ProjectDashboard
      pollInterval={1000 * 60}
      render={({project: {key, latestWorkItemEvent, latestCommit}, context}) => {
        return (
          <Dashboard dashboard={`${dashboard_id}`}>
            <DashboardRow
              h={"50%"}
              title={""}
              controls={[() => <ConfigSelector configTab={configTab} setConfigTab={setConfigTab} />]}
            >
              {configTab === "value-stream"
                ? getValueStreamElements({instanceKey: key, latestWorkItemEvent, latestCommit, context, days: 30})
                : getFlowMetricsSettingElements()}
            </DashboardRow>
            <DashboardRow h="50%"></DashboardRow>
          </Dashboard>
        );
      }}
    />
  );
};

export default withViewerContext(dashboard);

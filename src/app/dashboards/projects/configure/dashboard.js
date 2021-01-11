import React from "react";
import {withViewerContext} from "../../../framework/viewer/viewerContext";
import {ProjectDashboard} from "../projectDashboard";
import {Dashboard, DashboardRow, DashboardWidget} from "../../../framework/viz/dashboard";
import {ConfigSelector} from "../shared/components/configSelector";
import {ProjectFlowMetricsSettingWidget} from "../shared/widgets/updateProjectSettings/projectFlowMetricsSettingWidget";
import {ProjectPipelineFunnelWidget} from "../shared/widgets/funnel/projectPipelineFunnelWidget";
import {WorkItemStateTypeMapWidget} from "../shared/widgets/workItemStateTypeMap";
import {TargetControlBarWidget} from "../shared/widgets/updateProjectSettings/TargetControlBarWidget";
import {settingsReducer} from "./settingsReducer";
import {CONFIG_TABS, METRICS, mode, actionTypes} from "./constants";
const dashboard_id = "dashboards.project.configure";

function ConfigureDashboard({project: {key, latestWorkItemEvent, latestCommit, settingsWithDefaults}, context}) {
  const initialState = {
    configTab: CONFIG_TABS.VALUE_STREAM,
    selectedMetric: METRICS.LEAD_TIME,
    leadTime: {
      target: settingsWithDefaults.leadTimeTarget,
      confidence: settingsWithDefaults.leadTimeConfidenceTarget,
      initialTarget: settingsWithDefaults.leadTimeTarget,
      initialConfidence: settingsWithDefaults.leadTimeConfidenceTarget,
      mode: mode.INIT,
    },
    cycleTime: {
      target: settingsWithDefaults.cycleTimeTarget,
      confidence: settingsWithDefaults.cycleTimeConfidenceTarget,
      initialTarget: settingsWithDefaults.cycleTimeTarget,
      initialConfidence: settingsWithDefaults.cycleTimeConfidenceTarget,
      mode: mode.INIT,
    },
  };
  const [state, dispatch] = React.useReducer(settingsReducer, initialState);

  // state for sliders
  const targetControlBarState = React.useMemo(
    () => ({
      leadTime: state.leadTime,
      cycleTime: state.cycleTime,
      selectedMetric: state.selectedMetric,
      dispatch,
    }),
    [state.leadTime, state.cycleTime, state.selectedMetric, dispatch]
  );

  // state for selected metric
  const selectedMetricState = React.useMemo(
    () => ({
      selectedMetric: state.selectedMetric,
      dispatch,
    }),
    [state.selectedMetric, dispatch]
  );

  const {leadTimeTarget, cycleTimeTarget, leadTimeConfidenceTarget, cycleTimeConfidenceTarget} = settingsWithDefaults;
  // after mutation is successful,we are invalidating active quries.
  // we need to update default settings from api response, this useEffect will serve the purpose.
  React.useEffect(() => {
    dispatch({
      type: actionTypes.UPDATE_DEFAULTS,
      payload: {leadTimeTarget, cycleTimeTarget, leadTimeConfidenceTarget, cycleTimeConfidenceTarget},
    });
  }, [leadTimeTarget, cycleTimeTarget, leadTimeConfidenceTarget, cycleTimeConfidenceTarget]);

  function getValueStreamElements() {
    if (state.configTab === CONFIG_TABS.VALUE_STREAM) {
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
    if (state.configTab === CONFIG_TABS.FLOW_METRICS) {
      return (
        <>
          <DashboardRow h="25%">
            <DashboardWidget
              w={1}
              name="flow-metrics-setting-sliders"
              render={({view}) => {
                return <TargetControlBarWidget targetControlBarState={targetControlBarState} projectKey={key} />;
              }}
              showDetail={false}
            />
          </DashboardRow>
          <DashboardRow h="70%">
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
                    selectedMetricState={selectedMetricState}
                    specsOnly={false}
                  />
                );
              }}
              showDetail={false}
            />
          </DashboardRow>
        </>
      );
    }
  }

  return (
    <Dashboard dashboard={`${dashboard_id}`}>
      <DashboardRow
        h={"5%"}
        title={""}
        controls={[
          () => (
            <ConfigSelector
              configTab={state.configTab}
              setConfigTab={(newTab) => dispatch({type: actionTypes.UPDATE_CONFIG_TAB, payload: newTab})}
            />
          ),
        ]}
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

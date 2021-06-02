import React from "react";
import {Dashboard, DashboardRow, DashboardWidget} from "../../../../../framework/viz/dashboard";
import {Box, Flex} from "reflexbox";
import {WorkItemScopeSelector} from "../../components/workItemScopeSelector";
import {ProjectPipelineCycleTimeLatencyWidget} from "./projectPipelineCycleTimeLatencyWidget";
import {WorkItemStateTypes} from "../../../../shared/config";
import {CycleTimeLatencyTableWidget} from "./cycleTimeLatencyTableWidget";
import styles from "./cycleTimeLatency.module.css";
import {Drawer} from "antd";
import {CardInspectorWidget} from "../../../../work_items/cardInspector/cardInspectorWidget";
const dashboard_id = "dashboards.project.pipeline.cycle_time_latency.detail";

export const ProjectPipelineCycleTimeLatencyDetailDashboard = ({
  instanceKey,
  latestWorkItemEvent,
  latestCommit,
  workItemScope,
  setWorkItemScope,
  specsOnly,
  days,
  cycleTimeTarget,
  targetPercentile,
  includeSubTasks,
  view,
  context,
}) => {
  const [showPanel, setShowPanel] = React.useState(false);
  const [workItemKey, setWorkItemKey] = React.useState();
  const [placement, setPlacement] = React.useState();
  const [appliedFilters, setAppliedFilters] = React.useState({});

  const callBacks = {setShowPanel, setWorkItemKey, setPlacement, setAppliedFilters};
  return (
    <Dashboard dashboard={dashboard_id} className={styles.cycleTimeLatencyDashboard} gridLayout={true}>
      <DashboardRow
        title={``}
        subTitle={``}
        className={styles.workItemScope}
        controls={[
          () => (
            <Flex align={"center"}>
              <Box w={"100%"}>
                <WorkItemScopeSelector workItemScope={workItemScope} setWorkItemScope={setWorkItemScope} />
              </Box>
            </Flex>
          ),
        ]}
      >
        <DashboardWidget
          name="engineering"
          className={styles.engineering}
          render={({view}) => (
            <ProjectPipelineCycleTimeLatencyWidget
              instanceKey={instanceKey}
              view={view}
              stageName={"Engineering"}
              stateTypes={[WorkItemStateTypes.open, WorkItemStateTypes.make]}
              cycleTimeTarget={cycleTimeTarget}
              specsOnly={specsOnly}
              workItemScope={workItemScope}
              setWorkItemScope={setWorkItemScope}
              context={context}
              latestWorkItemEvent={latestWorkItemEvent}
              latestCommit={latestCommit}
              targetPercentile={targetPercentile}
              includeSubTasks={includeSubTasks}
              tooltipType="big"
              callBacks={callBacks}
              appliedFilters={appliedFilters}
            />
          )}
          showDetail={false}
        />
        <DashboardWidget
          name="delivery"
          className={styles.delivery}
          render={({view}) => {
            return (
              <ProjectPipelineCycleTimeLatencyWidget
                instanceKey={instanceKey}
                view={view}
                stageName={"Delivery"}
                stateTypes={[WorkItemStateTypes.deliver]}
                groupByState={true}
                cycleTimeTarget={cycleTimeTarget}
                context={context}
                latestWorkItemEvent={latestWorkItemEvent}
                latestCommit={latestCommit}
                targetPercentile={targetPercentile}
                specsOnly={specsOnly}
                workItemScope={workItemScope}
                setWorkItemScope={setWorkItemScope}
                includeSubTasks={includeSubTasks}
                tooltipType="big"
                callBacks={callBacks}
                appliedFilters={appliedFilters}
              />
            );
          }}
          showDetail={false}
        />
      </DashboardRow>
      <DashboardRow>
        <DashboardWidget
          name="cycle-time-latency-table"
          className={styles.cycleTimeLatencyTable}
          render={({view}) => (
            <CycleTimeLatencyTableWidget
              instanceKey={instanceKey}
              specsOnly={specsOnly}
              latestWorkItemEvent={latestWorkItemEvent}
              latestCommit={latestCommit}
              includeSubTasks={includeSubTasks}
              callBacks={callBacks}
              appliedFilters={appliedFilters}
            />
          )}
        />
      </DashboardRow>
      <DashboardRow>
        <DashboardWidget
          name="drawer-widget"
          className={styles.cardInspectorPanel}
          render={({view}) => {
            return (
              workItemKey && (
                <Drawer
                  placement={placement}
                  height={350}
                  closable={false}
                  onClose={() => setShowPanel(false)}
                  visible={showPanel}
                  key={workItemKey}
                >
                  <CardInspectorWidget context={context} workItemKey={workItemKey} />
                </Drawer>
              )
            );
          }}
        />
      </DashboardRow>
    </Dashboard>
  );
};

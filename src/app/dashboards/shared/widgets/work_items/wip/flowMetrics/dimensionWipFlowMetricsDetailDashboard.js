import React, {useState} from "react";
import {Dashboard, DashboardRow, DashboardWidget} from "../../../../../../framework/viz/dashboard";
import {ProjectPipelinePhaseSummaryWidget} from "../../../../../projects/shared/widgets/wip/projectPipelinePhaseSummaryWidget";
import {DimensionValueStreamPhaseDetailWidget} from "../../valueStreamPhaseDetail";
import {Box, Flex} from "reflexbox";
import {WorkItemScopeSelector} from "../../../../components/workItemScopeSelector/workItemScopeSelector";
import { AppTerms } from "../../../../config";

const dashboard_id = "dashboards.activity.projects.pipeline.detail";

export const DimensionWipFlowMetricsDetailDashboard = ({
  dimension,
  instanceKey,
  context,
  latestWorkItemEvent,
  stateMappingIndex,
  days,
  targetPercentile,
  leadTimeTargetPercentile,
  cycleTimeTargetPercentile,
  includeSubTasks
}) => {
  const [workItemScope, setWorkItemScope] = useState("specs");
  const specsOnly = workItemScope === "specs";

  return (
    <Dashboard dashboard={dashboard_id}>
      <DashboardRow
        h={"15%"}
        title={`Work In Process`}
        controls={[
          () => (
            <div style={{padding: "10px"}}>
              <Flex align={"center"}>
                <Box pr={2} w={"100%"}>
                  <WorkItemScopeSelector workItemScope={workItemScope} setWorkItemScope={setWorkItemScope} />
                </Box>
              </Flex>
            </div>
          ),
        ]}
      >
        <DashboardWidget
          w={1 / 4}
          name="project-pipeline-summary-detail-view"
          subtitle={specsOnly ? `Active ${AppTerms.specs.display} by Phase` : `All Active ${AppTerms.cards.display} by Phase`}
          render={({view}) => (
            <ProjectPipelinePhaseSummaryWidget
              instanceKey={instanceKey}
              specsOnly={specsOnly}
              view={view}
              latestWorkItemEvent={latestWorkItemEvent}
              stateMappingIndex={stateMappingIndex}
              includeSubTasks={includeSubTasks}
            />
          )}
          showDetail={false}
        />
      </DashboardRow>
      <DashboardRow h={"81%"}>
        <DashboardWidget
          w={1}
          name="project-pipeline-state-detail-view"
          render={({view}) => (
            <DimensionValueStreamPhaseDetailWidget
              dimension={dimension}
              instanceKey={instanceKey}
              specsOnly={specsOnly}
              view={view}
              context={context}
              latestWorkItemEvent={latestWorkItemEvent}
              stateMappingIndex={stateMappingIndex}
              days={days}
              activeOnly={true}
              targetPercentile={cycleTimeTargetPercentile}
              includeSubTasks={includeSubTasks}
            />
          )}
          showDetail={true}
        />
      </DashboardRow>
    </Dashboard>
  );
};

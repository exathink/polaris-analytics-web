import React, { useState } from "react";
import { Dashboard, DashboardRow, DashboardWidget } from "../../../../../framework/viz/dashboard";

import { ProjectPipelineFunnelWidget } from "./projectPipelineFunnelWidget";
import { DimensionValueStreamPhaseDetailWidget } from "../../../../shared/widgets/work_items/valueStreamPhaseDetail";
import { Box, Flex } from "reflexbox";
import { WorkItemScopeSelector } from "../../../../shared/components/workItemScopeSelector/workItemScopeSelector";
import { GroupingSelector } from "../../../../shared/components/groupingSelector/groupingSelector";
import { useQueryParamState } from "../../helper/hooks";

const dashboard_id = "dashboards.project.pipeline.detail";

export const ProjectPipelineFunnelDetailDashboard = ({
                                                       instanceKey,
                                                       latestWorkItemEvent,
                                                       latestCommit,
                                                       days,
                                                       view,
                                                       context,
                                                       pollInterval,
                                                       leadTimeConfidenceTarget,
                                                       cycleTimeConfidenceTarget,
                                                       leadTimeTarget,
                                                       cycleTimeTarget,
                                                       includeSubTasks
                                                     }) => {
  const [daysRange] = React.useState(days);
  const [workItemScope, setWorkItemScope] = useState("all");
  const [volumeOrEffort, setVolumeOrEffort] = useState(workItemScope === "all" ? 'volume' : 'volume');

  const {state} = useQueryParamState();
  const workItemSelectors = state?.vs?.workItemSelectors??[];
  const release = state?.release?.releaseValue;

  const specsOnly = workItemScope === "specs";

  return (
    <Dashboard dashboard={dashboard_id}>
      <DashboardRow
        h={"100%"}
        controls={
          [
            () => (
              <div style={{ marginLeft: "20px", minWidth: "300px" }}>
                <Flex align={"center"}>
                  <Box w={"100%"}>
                    <WorkItemScopeSelector workItemScope={workItemScope} setWorkItemScope={setWorkItemScope} />
                  </Box>
                </Flex>
              </div>
            )
          ]

        }
      >
        <DashboardWidget
          w={1}
          name="project-pipeline-queues"
          render={({ view }) => (
            <DimensionValueStreamPhaseDetailWidget
              dimension={"project"}
              instanceKey={instanceKey}
              tags={workItemSelectors}
              release={release}
              context={context}
              funnelView={true}
              specsOnly={specsOnly}
              latestWorkItemEvent={latestWorkItemEvent}
              latestCommit={latestCommit}
              days={daysRange}
              closedWithinDays={daysRange}
              view={view}
              leadTimeConfidenceTarget={leadTimeConfidenceTarget}
              cycleTimeConfidenceTarget={cycleTimeConfidenceTarget}
              leadTimeTarget={leadTimeTarget}
              cycleTimeTarget={cycleTimeTarget}
              includeSubTasks={includeSubTasks}
              workItemScope={workItemScope}
              setWorkItemScope={setWorkItemScope}
              defaultToHistogram={false}
            />
          )}
          showDetail={false}
        />
      </DashboardRow>
    </Dashboard>
  );
};

import React, { useState } from "react";
import { Dashboard, DashboardRow, DashboardWidget } from "../../../../../framework/viz/dashboard";

import { ProjectPipelineFunnelWidget } from "./projectPipelineFunnelWidget";
import { DimensionValueStreamPhaseDetailWidget } from "../../../../shared/widgets/work_items/valueStreamPhaseDetail";
import { Box, Flex } from "reflexbox";
import { WorkItemScopeSelector } from "../../../../shared/components/workItemScopeSelector/workItemScopeSelector";
import { DimensionVolumeTrendsWidget } from "../../../../shared/widgets/work_items/trends/volume";
import { DimensionWorkBalanceTrendsWidget } from "../../../../shared/widgets/work_items/balance";
import { DaysRangeSlider, SIX_MONTHS } from "../../../../shared/components/daysRangeSlider/daysRangeSlider";
import { DimensionResponseTimeTrendsWidget } from "../../../../shared/widgets/work_items/trends/responseTime";
import { GroupingSelector } from "../../../../shared/components/groupingSelector/groupingSelector";

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
  const [daysRange, setDaysRange] = React.useState(days);
  const [workItemScope, setWorkItemScope] = useState("all");
  const [volumeOrEffort, setVolumeOrEffort] = useState(workItemScope === "all" ? 'volume' : 'volume');

  const specsOnly = workItemScope === "specs";

  return (
    <Dashboard dashboard={dashboard_id}>
      <DashboardRow
        h={"40%"}
        title={``}
        subTitle={``}
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
            ),
            () => (
              <div style={{ marginLeft: "20px", minWidth: "100px" }}>
                <Flex align={"center"}>
                  <GroupingSelector
                    label={"Show"}

                    groupings={
                      specsOnly ?
                        [
                          {
                            key: "volume",
                            display: "Time to Clear"
                          },
                          {
                            key: "effort",
                            display: "Cost"
                          }
                        ]
                        : [
                          {
                            key: "volume",
                            display: "Time to Clear"
                          }
                        ]
                    }
                    initialValue={'volume'}
                    value={volumeOrEffort}
                    onGroupingChanged={(selected) => setVolumeOrEffort(selected)}

                  />
                </Flex>
              </div>
            )
          ]

        }
      >
        <DashboardWidget
          w={1 / 3}
          name="project-pipeline-funnel-detailed"
          render={({ view }) => (
            null
          )}
          showDetail={false}
        />
        <DashboardWidget
          w={1 / 3}
          name="project-pipeline-funnel-detailed"
          render={({ view }) => (
            <ProjectPipelineFunnelWidget
              instanceKey={instanceKey}
              context={context}
              workItemScope={workItemScope}
              latestWorkItemEvent={latestWorkItemEvent}
              latestCommit={latestCommit}
              days={daysRange}
              showVolumeOrEffort={volumeOrEffort}
              leadTimeTarget={leadTimeTarget}
              cycleTimeTarget={cycleTimeTarget}
              view={view}
              includeSubTasks={includeSubTasks}
            />
          )}
          showDetail={false}
        />
         <DashboardWidget
          w={1 / 3}
          name="project-pipeline-funnel-detailed"
          render={({ view }) => (
            null
          )}
          showDetail={false}
        />
      </DashboardRow>
      <DashboardRow h={"55%"}>
        <DashboardWidget
          w={1}
          name="project-pipeline-queues"
          render={({ view }) => (
            <DimensionValueStreamPhaseDetailWidget
              dimension={"project"}
              instanceKey={instanceKey}
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
          showDetail={true}
        />
      </DashboardRow>
    </Dashboard>
  );
};

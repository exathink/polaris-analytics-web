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
  const [workItemScope, setWorkItemScope] = useState("specs");
  const [volumeOrEffort, setVolumeOrEffort] = useState(workItemScope === "all" ? 'volume' : 'volume');

  const specsOnly = workItemScope === "specs";

  return (
    <Dashboard dashboard={dashboard_id}>
      <DashboardRow
        h={"47%"}
        title={``}
        subTitle={``}
        controls={
          [
            () => (
              <div style={{ minWidth: "500px" }}>
                <DaysRangeSlider initialDays={daysRange} setDaysRange={setDaysRange} range={SIX_MONTHS} />
              </div>
            ),
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
                            display: "Capacity"
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
          name="cycle-time"
          render={({ view }) => (
            <DimensionResponseTimeTrendsWidget
              dimension={"project"}
              title={"Response Time"}
              instanceKey={instanceKey}
              measurementWindow={daysRange}
              days={daysRange}
              samplingFrequency={7}
              specsOnly={specsOnly}
              leadTimeTarget={leadTimeTarget}
              cycleTimeTarget={cycleTimeTarget}
              leadTimeConfidenceTarget={leadTimeConfidenceTarget}
              cycleTimeConfidenceTarget={cycleTimeConfidenceTarget}
              targetPercentile={cycleTimeConfidenceTarget}
              context={context}
              view={view}
              showAnnotations={true}
              latestWorkItemEvent={latestWorkItemEvent}
              defaultSeries={["all"]}
              includeSubTasks={includeSubTasks}
            />
          )}
          showDetail={true}
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
        {
          volumeOrEffort === "effort" &&
          <DashboardWidget
            w={1 / 3}
            name="capacity"
            render={({ view }) => (
              <DimensionWorkBalanceTrendsWidget
                dimension={"project"}
                instanceKey={instanceKey}
                measurementWindow={daysRange}
                days={daysRange}
                samplingFrequency={7}
                context={context}
                view={view}
                latestWorkItemEvent={latestWorkItemEvent}
                latestCommit={latestCommit}
                target={0.9}
                showEffort={true}
                showContributorDetail={false}
                chartConfig={{ totalEffortDisplayType: "column" }}
                includeSubTasks={includeSubTasks}
              />

            )}
            showDetail={true}
          />
        }
        {
          volumeOrEffort === "volume" &&
          <DashboardWidget
            w={1 / 3}
            name="throughput"
            render={({ view }) => (
              <DimensionVolumeTrendsWidget
                dimension={"project"}
                instanceKey={instanceKey}
                measurementWindow={30}
                days={daysRange}
                samplingFrequency={7}
                targetPercentile={0.7}
                context={context}
                view={view}
                latestWorkItemEvent={latestWorkItemEvent}
                leadTimeTarget={leadTimeTarget}
                cycleTimeTarget={cycleTimeTarget}
                leadTimeConfidenceTarget={leadTimeConfidenceTarget}
                cycleTimeConfidenceTarget={cycleTimeConfidenceTarget}
                includeSubTasks={includeSubTasks}
              />
            )}
            showDetail={true}
          />
        }
      </DashboardRow>
      <DashboardRow h={"48%"}>
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
            />
          )}
          showDetail={true}
        />
      </DashboardRow>
    </Dashboard>
  );
};

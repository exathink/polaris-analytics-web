import React, {useState} from "react";
import {Dashboard, DashboardRow, DashboardWidget} from "../../../../../framework/viz/dashboard";
import {Box, Flex} from "reflexbox";
import {WorkItemScopeSelector} from "../../components/workItemScopeSelector";
import {ProjectImplementationCostWidget} from "./projectImplementationCostWidget";
import {ImplementationCostTableWidget} from "./implementationCostTableWidget";
import {DaysRangeSlider, ONE_YEAR} from "../../../../shared/components/daysRangeSlider/daysRangeSlider";

const dashboard_id = "dashboards.project.epic.flow.detail";

export const ProjectImplementationCostDetailDashboard = ({
  instanceKey,
  context,
  latestWorkItemEvent,
  latestCommit,
  activeOnly,
  days,
  view,
  includeSubTasks,
}) => {
  const [workItemScope, setWorkItemScope] = useState("specs");
  const specsOnly = workItemScope === "specs";
  const [activeWithinDays, setActiveWithinDays] = React.useState(days);

  return (
    <Dashboard dashboard={dashboard_id}>
      <DashboardRow
        h={"50%"}
        title={``}
        subTitle={``}
        controls={[
          () => (
            <div style={{minWidth: "300px"}}>
              <Flex align={"center"}>
                <Box pr={2} w={"100%"}>
                  <WorkItemScopeSelector
                    display={["Specs", "All"]}
                    workItemScope={workItemScope}
                    setWorkItemScope={setWorkItemScope}
                  />
                </Box>
              </Flex>
            </div>
          ),

          () => (
            <div style={{minWidth: "500px"}}>
              <DaysRangeSlider
                title={"Days"}
                initialDays={activeWithinDays}
                setDaysRange={setActiveWithinDays}
                range={ONE_YEAR}
              />
            </div>
          ),
        ]}
      >
        <DashboardWidget
          w={1}
          name="epic-flow-mix-detailed"
          render={({view}) => (
            <ProjectImplementationCostWidget
              instanceKey={instanceKey}
              context={context}
              days={activeWithinDays}
              specsOnly={specsOnly}
              activeOnly={activeOnly}
              view={view}
              latestCommit={latestCommit}
              latestWorkItemEvent={latestWorkItemEvent}
              includeSubTasks={includeSubTasks}
            />
          )}
          showDetail={false}
        />
      </DashboardRow>
      <DashboardRow h="39%">
        <DashboardWidget
          w={1}
          name="implementation-cost-table-widget"
          render={({view}) => (
            <ImplementationCostTableWidget
              instanceKey={instanceKey}
              activeWithinDays={activeWithinDays}
              latestCommit={latestCommit}
              latestWorkItemEvent={latestWorkItemEvent}
              context={context}
              view={view}
              includeSubTasks={includeSubTasks}
              specsOnly={specsOnly}
            />
          )}
          showDetail={false}
        />
      </DashboardRow>
    </Dashboard>
  );
};

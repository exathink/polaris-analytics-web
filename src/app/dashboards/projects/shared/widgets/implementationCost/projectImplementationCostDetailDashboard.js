import React, {useState} from "react";
import {Dashboard, DashboardRow, DashboardWidget} from "../../../../../framework/viz/dashboard";
import {Box, Flex} from "reflexbox";
import {WorkItemScopeSelector} from "../../components/workItemScopeSelector";
import {ProjectImplementationCostWidget} from "./projectImplementationCostWidget";

const dashboard_id = "dashboards.project.epic.flow.detail";

export const ProjectImplementationCostDetailDashboard = ({
  instanceKey,
  context,
  latestWorkItemEvent,
  latestCommit,
  activeOnly,
  days,
  view,
}) => {
  const [workItemScope, setWorkItemScope] = useState("specs");
  const specsOnly = workItemScope === "specs";

  return (
    <Dashboard dashboard={dashboard_id}>
      <DashboardRow
        h={"90%"}
        title={``}
        subTitle={``}
        controls={[
          () => (
            <div style={{minWidth: "300px"}}>
              <Flex align={"center"}>
                <Box pr={2} w={"100%"}>
                  <WorkItemScopeSelector display={['Effort', 'Volume']} workItemScope={workItemScope} setWorkItemScope={setWorkItemScope} />
                </Box>
              </Flex>
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
              days={days}
              specsOnly={specsOnly}
              activeOnly={activeOnly}
              view={view}
              latestCommit={latestCommit}
              latestWorkItemEvent={latestWorkItemEvent}
              showHierarchy={true}
            />
          )}
          showDetail={false}
        />
      </DashboardRow>
    </Dashboard>
  );
};

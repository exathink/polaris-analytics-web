import React, {useState} from "react";
import {Dashboard, DashboardRow, DashboardWidget} from "../../../../../framework/viz/dashboard";
import {Flex} from "reflexbox";
import {WorkItemScopeSelector} from "../../components/workItemScopeSelector";
import {ProjectImplementationCostWidget} from "./projectImplementationCostWidget";
import {ImplementationCostTableWidget} from "./implementationCostTableWidget";
import {DaysRangeSlider, ONE_YEAR} from "../../../../shared/components/daysRangeSlider/daysRangeSlider";
import styles from "./implementationCost.module.css";
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
  const [closedWithinDays, setClosedWithinDays] = React.useState(days);

  return (
    <Dashboard dashboard={dashboard_id} className={styles.valueDetailDashboard} gridLayout={true}>
      {!activeOnly && (
        <div className={styles.daysRangeSlider}>
          <DaysRangeSlider
            title={"Days"}
            initialDays={closedWithinDays}
            setDaysRange={setClosedWithinDays}
            range={ONE_YEAR}
          />
        </div>
      )}
      <div className={styles.scopeSelector}>
        <Flex w={1} justify={"center"}>
          <WorkItemScopeSelector workItemScope={workItemScope} setWorkItemScope={setWorkItemScope} />
        </Flex>
      </div>
      <DashboardRow h={"50%"} title={``} subTitle={``}>
        <DashboardWidget
          name="epic-flow-mix-detailed"
          className={styles.valueBookChart}
          render={({view}) => (
            <ProjectImplementationCostWidget
              instanceKey={instanceKey}
              context={context}
              days={closedWithinDays}
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
          name="implementation-cost-table-widget"
          className={styles.valueBookTable}
          render={({view}) => (
            <ImplementationCostTableWidget
              instanceKey={instanceKey}
              closedWithinDays={closedWithinDays}
              latestCommit={latestCommit}
              latestWorkItemEvent={latestWorkItemEvent}
              context={context}
              view={view}
              includeSubTasks={includeSubTasks}
              specsOnly={specsOnly}
              activeOnly={activeOnly}
            />
          )}
          showDetail={false}
        />
      </DashboardRow>
    </Dashboard>
  );
};

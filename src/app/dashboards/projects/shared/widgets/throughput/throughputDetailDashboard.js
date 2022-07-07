import React from "react";
import {Dashboard, DashboardRow, DashboardWidget} from "../../../../../framework/viz/dashboard";
import {ThroughputCardWidget} from "./throughputCardWidget";

const dashboard_id = "dashboards.trends.projects.throughput.detail";

export const ThroughputDetailDashboard = ({
  dimension,
  instanceKey,
  flowAnalysisPeriod,
  trendAnalysisPeriod,
  latestCommit,
  latestWorkItemEvent,
  targetPercentile,
  specsOnly,
  includeSubTasks,
}) => {
  return (
    <Dashboard dashboard={dashboard_id} gridLayout={true} className="tw-grid tw-grid-cols-3 tw-gap-2">
      <DashboardRow>
        <DashboardWidget
          w={1}
          name="throughput-summary"
          className="tw-p-2"
          render={({view}) => (
            <ThroughputCardWidget
              dimension={dimension}
              instanceKey={instanceKey}
              displayType="card"
              view={view}
              flowAnalysisPeriod={flowAnalysisPeriod}
              trendAnalysisPeriod={trendAnalysisPeriod}
              latestCommit={latestCommit}
              latestWorkItemEvent={latestWorkItemEvent}
              targetPercentile={targetPercentile}
              specsOnly={specsOnly}
              includeSubTasks={includeSubTasks}
            />
          )}
          showDetail={false}
        />
        <DashboardWidget
          w={1}
          name="volume-summary"
          className="tw-p-2"
          render={({view}) => <div>Volume Card Widget</div>}
          showDetail={false}
        />
        <DashboardWidget
          w={1}
          name="cadence-summary"
          className="tw-p-2"
          render={({view}) => <div>Cadence Card Widget</div>}
          showDetail={false}
        />
      </DashboardRow>
      <DashboardRow>
        <DashboardWidget
          w={1}
          className="tw-col-span-3 tw-p-2"
          name="throughput-volume-summary"
          render={({view}) => <div>Throughput Daily Volume Chart</div>}
          showDetail={false}
        />
      </DashboardRow>
    </Dashboard>
  );
};

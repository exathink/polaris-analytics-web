import classNames from "classnames";
import React from "react";
import {Dashboard, DashboardRow, DashboardWidget} from "../../../../../framework/viz/dashboard";
import {FlowMetricsTrendsWidget} from "../flowMetricsTrends/flowMetricsTrendsWidget";
import {CadenceCardWidget} from "./cadenceCardWidget";
import {ThroughputTrendsWidget} from "./throughputTrendsWidget";

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
  displayBag={}
}) => {
  const {classNameForFirstCard} = displayBag;
  return (
    <Dashboard dashboard={dashboard_id} gridLayout={true} className="tw-grid tw-grid-cols-3 tw-gap-2">
      <DashboardRow>
        <DashboardWidget
          w={1}
          name="throughput-summary"
          className={classNames("tw-h-32 tw-p-2", classNameForFirstCard)}
          render={({view}) => (
            <FlowMetricsTrendsWidget
              dimension="project"
              instanceKey={instanceKey}
              displayBag={{displayType: "card", metric: "throughput"}}
              flowAnalysisPeriod={flowAnalysisPeriod}
              trendAnalysisPeriod={trendAnalysisPeriod}
              targetPercentile={targetPercentile}
              specsOnly={specsOnly}
              latestCommit={latestCommit}
              latestWorkItemEvent={latestWorkItemEvent}
              includeSubTasks={includeSubTasks}
            />
          )}
          showDetail={false}
        />
        <DashboardWidget
          w={1}
          name="volume-summary"
          className="tw-p-2"
          render={({view}) => (
            <FlowMetricsTrendsWidget
              dimension="project"
              instanceKey={instanceKey}
              displayBag={{displayType: "card", metric: "volume"}}
              flowAnalysisPeriod={flowAnalysisPeriod}
              targetPercentile={targetPercentile}
              specsOnly={specsOnly}
              latestCommit={latestCommit}
              latestWorkItemEvent={latestWorkItemEvent}
              includeSubTasks={includeSubTasks}
            />
          )}
          showDetail={false}
        />
        <DashboardWidget
          w={1}
          name="cadence-summary"
          className="tw-p-2"
          render={({view}) => (
            <CadenceCardWidget
              dimension={dimension}
              instanceKey={instanceKey}
              displayType="card"
              flowAnalysisPeriod={flowAnalysisPeriod}
              latestCommit={latestCommit}
              latestWorkItemEvent={latestWorkItemEvent}
              targetPercentile={targetPercentile}
              specsOnly={specsOnly}
              includeSubTasks={includeSubTasks}
            />
          )}
          showDetail={false}
        />
      </DashboardRow>
      <DashboardRow>
        <DashboardWidget
          w={1}
          className="tw-col-span-3 tw-p-2"
          name="throughput-volume-summary"
          render={({view}) => (
            <ThroughputTrendsWidget
              dimension={dimension}
              instanceKey={instanceKey}
              flowAnalysisPeriod={flowAnalysisPeriod}
              trendAnalysisPeriod={trendAnalysisPeriod}
              targetPercentile={targetPercentile}
              specsOnly={specsOnly}
              includeSubTasks={includeSubTasks}
              latestCommit={latestCommit}
              latestWorkItemEvent={latestWorkItemEvent}
            />
          )}
          showDetail={false}
        />
      </DashboardRow>
    </Dashboard>
  );
};

import React, { useState } from "react";
import {Dashboard, DashboardRow, DashboardWidget} from "../../../../../framework/viz/dashboard";
import {PullRequestsCompletedTrendsWidget} from "../trends/pullRequestsCompleted";
import {PullRequestsReviewTimeTrendsWidget, ClosedPullRequestsCardWidget} from "../trends/pullRequestsReviewTime";
import {
  getTrendsControlBarControls,
  useTrendsControlBarState,
} from "../../../components/trendingControlBar/trendingControlBar";
import {DimensionPullRequestsWidget} from "./dimensionPullRequestsWidget";
import {OpenPullRequestsCardWidget} from "./openPullRequestsCardWidget";
import {getTodayDate, toMoment} from "../../../../../helpers/utility";
import { Flex } from "reflexbox";
import { GroupingSelector } from "../../../components/groupingSelector/groupingSelector";

const dashboard_id = "dashboards.projects.wip.pullrequests.detail";

export const DimensionPullRequestsDetailDashboard = ({
  dimension,
  instanceKey,
  specsOnly,
  view,
  context,
  days,
  measurementWindow,
  samplingFrequency,
  latestCommit,
  latestPullRequestEvent,
  latestWorkItemEvent,
  latencyTarget
}) => {
  const [
    [daysRange, setDaysRange],
    [measurementWindowRange, setMeasurementWindowRange],
    [frequencyRange, setFrequencyRange],
  ] = useTrendsControlBarState(days, measurementWindow, samplingFrequency);

  const [before, setBefore] = React.useState();
  const [selectedFilter, setFilter] = React.useState(null);
  const [cardSelection, setCardSelection] = React.useState("open");
  const [traceableOrAll, setTraceableOrAll] = useState(specsOnly ? "traceable" : "all");
  const traceableOnly = traceableOrAll === 'traceable'

  React.useEffect(() => {
    if (cardSelection === "open" || cardSelection===undefined) {
      setBefore(undefined)
    }
  }, [cardSelection]);

  return (
    <Dashboard
      dashboard={dashboard_id}
      gridLayout={true}
      className="tw-grid tw-grid-cols-6 tw-grid-rows-[7%_20%_36%_33%] tw-gap-2 tw-p-2"
    >
      <div className="tw-col-span-2 tw-col-start-1 tw-row-start-1 tw-text-2xl tw-text-gray-300">
        <div className="tw-flex tw-justify-start">Code Review Flow Analysis</div>
        <div className="tw-flex tw-justify-start tw-text-sm">
          Open and Closed Pull Requests, Last {measurementWindow} Days
        </div>
      </div>
      <DashboardRow
        title={``}
        subTitle={``}
        className="tw-col-span-4 tw-col-start-3 tw-text-base"
        controls={[
          ...getTrendsControlBarControls(
          [
            [daysRange, setDaysRange],
            [measurementWindowRange, setMeasurementWindowRange],
            [frequencyRange, setFrequencyRange],
          ], "row"),
          () => <GroupingSelector
              label={"Show"}
              groupings={[
                {
                  key: "traceable",
                  display: "Traceable",
                },
                {
                  key: "all",
                  display: "All",
                },
              ]}
              initialValue={"traceable"}
              value={traceableOrAll}
              onGroupingChanged={(selected) => setTraceableOrAll(selected)}
            />
        ]}
      >
        <DashboardWidget
          name="pr-closed-summary"
          className="tw-col-span-3"
          render={({view}) => {
            return (
              <ClosedPullRequestsCardWidget
                dimension={dimension}
                instanceKey={instanceKey}
                specsOnly={traceableOnly}
                view={view}
                days={daysRange}
                measurementWindow={daysRange}
                samplingFrequency={daysRange}
                latestCommit={latestCommit}
                cardSelection={cardSelection}
                latencyTarget={latencyTarget}
                onClick={() => {
                  if (cardSelection !== "closed") {
                    setCardSelection("closed");
                  } else {
                    setCardSelection(undefined);
                  }
                }}
              />
            );
          }}
        />

        <DashboardWidget
          name="pr-open-summary"
          className="tw-col-span-3"
          render={({view}) => {
            return (
              <OpenPullRequestsCardWidget
                dimension={dimension}
                instanceKey={instanceKey}
                view={view}
                latestCommit={latestCommit}
                latestWorkItemEvent={latestWorkItemEvent}
                latestPullRequestEvent={latestPullRequestEvent}
                activeOnly={true}
                specsOnly={traceableOnly}
                cardSelection={cardSelection}
                onClick={() => {
                  if (cardSelection !== "open") {
                    setCardSelection("open");
                  } else {
                    setCardSelection(undefined);
                  }
                }}
              />
            );
          }}
        />
      </DashboardRow>
      <DashboardRow>
        <DashboardWidget
          name="pr-metrics-summary-detailed"
          className="tw-col-span-2"
          render={({view}) => (
            <PullRequestsCompletedTrendsWidget
              dimension={dimension}
              instanceKey={instanceKey}
              specsOnly={traceableOnly}
              view={view}
              days={daysRange}
              measurementWindow={measurementWindowRange}
              samplingFrequency={frequencyRange}
              latestCommit={latestCommit}
              setBefore={setBefore}
            />
          )}
          showDetail={false}
        />
        <DashboardWidget
          name="pr-pull-req-detailed"
          className="tw-col-span-2"
          render={({view}) => (
            <DimensionPullRequestsWidget
              dimension={dimension}
              instanceKey={instanceKey}
              view={view}
              context={context}
              latestWorkItemEvent={latestWorkItemEvent}
              latestCommit={latestCommit}
              latestPullRequestEvent={latestPullRequestEvent}
              selectedFilter={selectedFilter}
              setFilter={setFilter}
              activeOnly={cardSelection === "closed" || before ? undefined : true}
              specsOnly={traceableOnly}
              before={before}
              setBefore={setBefore}
              closedWithinDays={cardSelection === "closed" || before ? measurementWindowRange : undefined}
              display="histogram"
            />
          )}
          showDetail={false}
        />
        <DashboardWidget
          name="pr-metrics-reviewtime-detailed"
          className="tw-col-span-2"
          render={({view}) => (
            <PullRequestsReviewTimeTrendsWidget
              dimension={dimension}
              instanceKey={instanceKey}
              specsOnly={traceableOnly}
              view={view}
              days={daysRange}
              measurementWindow={measurementWindowRange}
              samplingFrequency={frequencyRange}
              latestCommit={latestCommit}
              setBefore={setBefore}
            />
          )}
          showDetail={false}
        />
      </DashboardRow>
      <DashboardRow>
        <DashboardWidget
          name="pr-pull-req-table"
          className="tw-col-span-6 tw-h-full"
          render={({view}) => (
            <DimensionPullRequestsWidget
              dimension={dimension}
              instanceKey={instanceKey}
              view={view}
              context={context}
              latestWorkItemEvent={latestWorkItemEvent}
              latestCommit={latestCommit}
              latestPullRequestEvent={latestPullRequestEvent}
              activeOnly={cardSelection === "closed" || before ? undefined : true}
              before={cardSelection === "closed" && before === undefined ? toMoment(getTodayDate()) : before}
              specsOnly={traceableOnly}
              setBefore={setBefore}
              closedWithinDays={
                cardSelection === "closed" && before === undefined
                  ? daysRange
                  : before
                  ? measurementWindowRange
                  : undefined
              }
              display="table"
              selectedFilter={selectedFilter}
              setFilter={setFilter}
            />
          )}
          showDetail={false}
        />
      </DashboardRow>
    </Dashboard>
  );
};

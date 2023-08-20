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

export const DimensionOpenPullRequestsTrendsDashboard = ({
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
    >
      <DashboardRow
        h={"40%"}
        >
        <DashboardWidget
          name="pr-pull-req-detailed"
          w={1}
          title={"Pending Code Reviews"}
          controls={[
            () => (
              <GroupingSelector
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
            ),
          ]}
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

      </DashboardRow>
      <DashboardRow h={"50%"}>
        <DashboardWidget
          name="pr-pull-req-table"
          w={1}
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

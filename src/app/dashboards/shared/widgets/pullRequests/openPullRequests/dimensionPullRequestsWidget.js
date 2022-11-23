import React from "react";
import {Loading} from "../../../../../components/graphql/loading";
import {useQueryDimensionPullRequests} from "../hooks/useQueryDimensionPullRequests";
import {OpenPullRequestsView} from "./openPullRequestsView";
import {getReferenceString} from "../../../../../helpers/utility";
import {DimensionPullRequestsDetailDashboard} from "./dimensionPullRequestsDetailDashboard";
import {logGraphQlError} from "../../../../../components/graphql/utils";
import {PullRequestsView} from "../pullRequestsUtils/pullRequestsView";

// use activeOnly prop for inProgress and closedWithinDays prop for closed pull requests
// at a time, we can use only one prop
export const DimensionPullRequestsWidget = ({
  dimension,
  instanceKey,
  days,
  measurementWindow,
  samplingFrequency,
  latencyTarget,
  latestWorkItemEvent,
  latestCommit,
  latestPullRequestEvent,
  view,
  context,
  pollInterval,
  activeOnly,
  closedWithinDays,
  asStatistic,
  asCard,
  display,
  before,
  setBefore,
  selectedFilter,
  setFilter,
  displayBag
}) => {
  const {loading, error, data} = useQueryDimensionPullRequests({
    dimension,
    instanceKey,
    activeOnly: activeOnly,
    before: before,
    closedWithinDays: closedWithinDays,
    referenceString: getReferenceString(latestCommit, latestWorkItemEvent, latestPullRequestEvent),
  });

  const pullRequests = React.useMemo(() => {
    const edges = data?.[dimension]?.["pullRequests"]?.["edges"] ?? [];
    return edges.map((edge) => edge.node);
  }, [data, dimension]);

  const pullRequestsType = activeOnly ? "open" : "closed";
  if (loading) return <Loading />;
  if (error) {
    logGraphQlError("useQueryProjectPullRequests", error);
    return null;
  }

  if (view === "detail") {
    return (
      <DimensionPullRequestsDetailDashboard
        dimension={dimension}
        instanceKey={instanceKey}
        latestWorkItemEvent={latestWorkItemEvent}
        latestCommit={latestCommit}
        latestPullRequestEvent={latestPullRequestEvent}
        context={context}
        days={days}
        measurementWindow={measurementWindow || Math.min(days,7)}
        samplingFrequency={samplingFrequency || Math.min(days,7)}
        latencyTarget={latencyTarget}
      />
    );
  } else {
    if (pullRequestsType==="open" && (asStatistic)) {
      return (
        <OpenPullRequestsView pullRequests={pullRequests} view={view} context={context} asStatistic={asStatistic} />
      );
    }
    return (
      <PullRequestsView
        before={before}
        setBefore={setBefore}
        selectedFilter={selectedFilter}
        setFilter={setFilter}
        display={display}
        pullRequests={pullRequests}
        closedWithinDays={closedWithinDays}
        view={view}
        context={context}
        pullRequestsType={pullRequestsType}
        displayBag={displayBag}
      />
    );
    
  }
};

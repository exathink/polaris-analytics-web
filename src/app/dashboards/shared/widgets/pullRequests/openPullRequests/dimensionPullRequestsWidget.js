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
  setBefore
}) => {
  const {loading, error, data} = useQueryDimensionPullRequests({
    dimension,
    instanceKey,
    activeOnly: activeOnly,
    before: before,
    closedWithinDays: closedWithinDays,
    referenceString: getReferenceString(latestCommit, latestWorkItemEvent, latestPullRequestEvent),
  });
  const pullRequestsType = activeOnly ? "open" : "closed";
  if (loading) return <Loading />;
  if (error) {
    logGraphQlError("useQueryProjectPullRequests", error);
    return null;
  }
  const pullRequests = data[dimension]["pullRequests"]["edges"].map((edge) => edge.node);

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
      />
    );
  } else {
    if (pullRequestsType==="open" && (asStatistic || asCard)) {
      return (
        <OpenPullRequestsView pullRequests={pullRequests} view={view} context={context} asStatistic={asStatistic} asCard={asCard} />
      );
    }
    return (
      <PullRequestsView
        before={before}
        setBefore={setBefore}
        display={display}
        pullRequests={pullRequests}
        closedWithinDays={closedWithinDays}
        view={view}
        context={context}
        pullRequestsType={pullRequestsType}
      />
    );
    
  }
};

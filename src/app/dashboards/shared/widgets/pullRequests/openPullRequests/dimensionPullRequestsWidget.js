import React from "react";
import {Loading} from "../../../../../components/graphql/loading";
import {useQueryDimensionPullRequests} from "../hooks/useQueryDimensionPullRequests";
import {OpenPullRequestsView} from "./openPullRequestsView";
import {getReferenceString} from "../../../../../helpers/utility";
import {DimensionPullRequestsDetailDashboard} from "./dimensionPullRequestsDetailDashboard";
import {logGraphQlError} from "../../../../../components/graphql/utils";
import {PullRequestsView} from "../closedPullRequests/pullRequestsView";

// use activeOnly prop for inProgress and closedWithinDays prop for closed pull requests
// at at time, we can use only one prop
export const DimensionPullRequestsWidget = ({
  dimension,
  instanceKey,
  latestWorkItemEvent,
  latestCommit,
  latestPullRequestEvent,
  view,
  context,
  pollInterval,
  activeOnly,
  closedWithinDays,
  asStatistic,
}) => {
  const {loading, error, data} = useQueryDimensionPullRequests({
    dimension,
    instanceKey,
    activeOnly: activeOnly,
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
        days={30}
        measurementWindow={1}
        samplingFrequency={1}
      />
    );
  } else {
    if (pullRequestsType==="open" && asStatistic) {
      return (
        <OpenPullRequestsView pullRequests={pullRequests} view={view} context={context} asStatistic={asStatistic} />
      );
    }
    return (
      <PullRequestsView
        pullRequests={pullRequests}
        closedWithinDays={closedWithinDays}
        view={view}
        context={context}
        pullRequestsType={pullRequestsType}
      />
    );
    
  }
};

import React from "react";
import {Loading} from "../../../../../components/graphql/loading";
import {useQueryDimensionPullRequests} from "../hooks/useQueryDimensionPullRequests";
import {getReferenceString} from "../../../../../helpers/utility";
import {logGraphQlError} from "../../../../../components/graphql/utils";
import {PullRequestsView} from "./pullRequestsView";

export const DimensionPullRequestsClosedWidget = ({
  dimension,
  instanceKey,
  latestWorkItemEvent,
  latestCommit,
  latestPullRequestEvent,
  view,
  context,
  pollInterval,
  closedWithinDays,
}) => {
  const {loading, error, data} = useQueryDimensionPullRequests({
    dimension,
    instanceKey,
    closedWithinDays: closedWithinDays,
    referenceString: getReferenceString(latestCommit, latestWorkItemEvent, latestPullRequestEvent),
  });
  if (loading) return <Loading />;
  if (error) {
    logGraphQlError("useQueryDimensionPullRequests", error);
    return null;
  }
  const pullRequests = data[dimension]["pullRequests"]["edges"].map((edge) => edge.node);

  if (view === "detail") {
    return (
      // implement detail dashboard later
      <div></div>
    );
  } else {
    return <PullRequestsView pullRequests={pullRequests} closedWithinDays={closedWithinDays} view={view} context={context} pullRequestsType="closed" />;
  }
};

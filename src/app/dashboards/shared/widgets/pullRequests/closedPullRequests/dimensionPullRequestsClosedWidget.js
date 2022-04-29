import React from "react";
import {Loading} from "../../../../../components/graphql/loading";
import {useQueryDimensionPullRequests} from "../hooks/useQueryDimensionPullRequests";
import {getReferenceString} from "../../../../../helpers/utility";
import {logGraphQlError} from "../../../../../components/graphql/utils";
import {ClosedPullRequestsView} from "./closedPullRequestsView";

export const DimensionPullRequestsClosedWidget = ({
  dimension,
  instanceKey,
  latestWorkItemEvent,
  latestCommit,
  latestPullRequestEvent,
  view,
  display,
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
    return <ClosedPullRequestsView display={display} pullRequests={pullRequests} view={view} context={context} />;
  }
};

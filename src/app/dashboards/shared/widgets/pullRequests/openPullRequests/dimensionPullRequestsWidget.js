import React from "react";
import {Loading} from "../../../../../components/graphql/loading";
import {useQueryDimensionPullRequests} from "../hooks/useQueryDimensionPullRequests";
import {OpenPullRequestsView} from "./openPullRequestsView";
import {getReferenceString} from "../../../../../helpers/utility";
import {DimensionPullRequestsDetailDashboard} from "./dimensionPullRequestsDetailDashboard";
import {logGraphQlError} from "../../../../../components/graphql/utils";

export const DimensionPullRequestsWidget = ({
  dimension,
  instanceKey,
  latestWorkItemEvent,
  latestCommit,
  latestPullRequestEvent,
  view,
  context,
  pollInterval,
  asStatistic,
}) => {
  const {loading, error, data} = useQueryDimensionPullRequests({
    dimension,
    instanceKey,
    activeOnly: true,
    referenceString: getReferenceString(latestCommit, latestWorkItemEvent, latestPullRequestEvent),
  });
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
    return (
      <OpenPullRequestsView
        pullRequests={pullRequests}
        view={view}
        context={context}
        asStatistic={asStatistic}
      />
    );
  }
};

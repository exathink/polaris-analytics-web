import React from "react";
import {Loading} from "../../../../../components/graphql/loading";
import {useQueryProjectPullRequests} from "../../../../projects/shared/hooks/useQueryProjectPullRequests";
import {ProjectOpenPullRequestsView} from "./projectOpenPullRequestsView";
import {getReferenceString} from "../../../../../helpers/utility";
import {ProjectPullRequestsDetailDashboard} from "./projectPullRequestsDetailDashboard";
import {logGraphQlError} from "../../../../../components/graphql/utils";

export const ProjectPullRequestsWidget = ({
  instanceKey,
  latestWorkItemEvent,
  latestCommit,
  latestPullRequestEvent,
  view,
  context,
  pollInterval,
  asStatistic,
}) => {
  const {loading, error, data} = useQueryProjectPullRequests({
    instanceKey,
    activeOnly: true,
    referenceString: getReferenceString(latestCommit, latestWorkItemEvent, latestPullRequestEvent),
  });
  if (loading) return <Loading />;
  if (error) {
    logGraphQlError("useQueryProjectPullRequests", error);
    return null;
  }
  const pullRequests = data["project"]["pullRequests"]["edges"].map((edge) => edge.node);

  if (view === "detail") {
    return (
      <ProjectPullRequestsDetailDashboard
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
      <ProjectOpenPullRequestsView
        pullRequests={pullRequests}
        view={view}
        context={context}
        asStatistic={asStatistic}
      />
    );
  }
};

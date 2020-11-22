import React from "react";
import { Loading } from "../../../../components/graphql/loading";
import { useQueryProjectPullRequests } from "../../shared/hooks/useQueryProjectPullRequests";
import { ProjectOpenPullRequestsView } from "./projectOpenPullRequestsView";
import {getReferenceString} from "../../../../helpers/utility";

export const ProjectOpenPullRequestsWidget = ({
  instanceKey,
  latestWorkItemEvent,
  latestCommit,
  view,
  context,
  pollInterval,
}) => {
  const { loading, error, data } = useQueryProjectPullRequests({
    instanceKey,
    activeOnly: true,
    referenceString: getReferenceString(latestCommit, latestWorkItemEvent)
  });
  if (loading) return <Loading />;
  if (error) return null;
  const pullRequests = data["project"]["pullRequests"]["edges"].map(
    (edge) => edge.node
  );

  return (
    <ProjectOpenPullRequestsView
      pullRequests={pullRequests}
      view={view}
      context={context}
    />
  );
};

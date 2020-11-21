import React from "react";
import { Loading } from "../../../../components/graphql/loading";
import { useQueryProjectPullRequests } from "../../shared/hooks/useQueryProjectPullRequests";
import { ProjectOpenPullRequestsView } from "./projectOpenPullRequestsView";

export const ProjectOpenPullRequestsWidget = ({
  instanceKey,
  latestWorkItemEvent,
  latestCommit,
  workItemScope,
  setWorkItemScope,
  specsOnly,
  view,
  context,
  pollInterval,
}) => {
  const { loading, error, data } = useQueryProjectPullRequests({
    instanceKey,
    activeOnly: true,
    referenceString: latestCommit,
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
      specsOnly={specsOnly}
      workItemScope={workItemScope}
      setWorkItemScope={setWorkItemScope}
    />
  );
};

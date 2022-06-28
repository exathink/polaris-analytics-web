import React from "react";
import {Loading} from "../../../../../components/graphql/loading";
import {useQueryDimensionPullRequests} from "../hooks/useQueryDimensionPullRequests";
import {OpenPullRequestsCardsView} from "./openPullRequestsView";
import {getReferenceString} from "../../../../../helpers/utility";
import {logGraphQlError} from "../../../../../components/graphql/utils";

export const OpenPullRequestsCardWidget = ({
  dimension,
  instanceKey,
  latestWorkItemEvent,
  latestCommit,
  latestPullRequestEvent,
  view,
  activeOnly,
}) => {
  const {loading, error, data} = useQueryDimensionPullRequests({
    dimension,
    instanceKey,
    activeOnly: activeOnly,
    referenceString: getReferenceString(latestCommit, latestWorkItemEvent, latestPullRequestEvent),
  });

  const pullRequests = React.useMemo(() => {
    const edges = data?.[dimension]?.["pullRequests"]?.["edges"] ?? [];
    return edges.map((edge) => edge.node);
  }, [data, dimension]);

  if (loading) return <Loading />;
  if (error) {
    logGraphQlError("useQueryProjectPullRequests", error);
    return null;
  }

  if (view === "primary") {
    return <OpenPullRequestsCardsView pullRequests={pullRequests} view={view} />;
  } else {
    return null;
  }
};

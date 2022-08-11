import React from "react";
import {Loading} from "../../../../../../components/graphql/loading";

import {useQueryProjectPullRequestMetricsTrends} from "../../../../../projects/shared/hooks/useQueryProjectPullRequestMetricsTrends";
import {ClosedPullRequestsCardView} from "./closedPullRequestsCardView";

export const ClosedPullRequestsCardWidget = React.memo(
  ({dimension, instanceKey, view, days, measurementWindow, samplingFrequency, latestCommit, cardSelection, onClick, latencyTarget}) => {
    const {loading, error, data} = useQueryProjectPullRequestMetricsTrends({
      dimension,
      instanceKey,
      days,
      measurementWindow,
      samplingFrequency,
      cardSelection,
      onClick,
      latencyTarget,
      referenceString: latestCommit,
    });
    const pullRequestMetricsTrends = React.useMemo(() => {
      return data?.[dimension]?.["pullRequestMetricsTrends"]?? [];
    }, [data, dimension]);

    if (loading) return <Loading />;
    if (error) return null;
    return view === "primary" ? (
      <ClosedPullRequestsCardView
        pullRequestMetricsTrends={pullRequestMetricsTrends}
        measurementWindow={measurementWindow}
        cardSelection={cardSelection}
        onClick={onClick}
        latencyTarget={latencyTarget}
      />
    ) : null;
  }
);

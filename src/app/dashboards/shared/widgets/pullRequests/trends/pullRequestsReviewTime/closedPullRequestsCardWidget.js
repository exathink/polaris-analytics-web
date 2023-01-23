import React from "react";
import {Loading} from "../../../../../../components/graphql/loading";

import {useQueryDimensionPullRequestMetricsTrends} from "../../../../../projects/shared/hooks/useQueryDimensionPullRequestMetricsTrends";
import {ClosedPullRequestsCardView} from "./closedPullRequestsCardView";

export const ClosedPullRequestsCardWidget = React.memo(
  ({dimension, instanceKey, specsOnly,  view, days, measurementWindow, samplingFrequency, latestCommit, cardSelection, onClick, latencyTarget}) => {
    const {loading, error, data} = useQueryDimensionPullRequestMetricsTrends({
      dimension,
      instanceKey,
      specsOnly,
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

import {Loading} from "../../../../../components/graphql/loading";
import React from "react";
import {getReferenceString} from "../../../../../helpers/utility";
import {useQueryDimensionFlowMetricsTrends} from "../../../../shared/widgets/work_items/hooks/useQueryDimensionFlowMetricsTrends";
import {logGraphQlError} from "../../../../../components/graphql/utils";
import {VolumeCardView} from "./throughputViews";

export const VolumeCardWidget = ({
  dimension,
  instanceKey,
  displayType,
  flowAnalysisPeriod,
  targetPercentile,
  specsOnly,
  latestWorkItemEvent,
  latestCommit,
  includeSubTasks,
}) => {
  const {loading, error, data} = useQueryDimensionFlowMetricsTrends({
    dimension,
    instanceKey,
    days: flowAnalysisPeriod,
    measurementWindow: flowAnalysisPeriod,
    samplingFrequency: flowAnalysisPeriod,
    targetPercentile,
    includeSubTasks,
    referenceString: getReferenceString(latestCommit, latestWorkItemEvent),
  });
  if (loading) return <Loading />;
  if (error) {
    logGraphQlError("VolumeCardWidget.useQueryDimensionFlowMetricsTrends", error);
    return null;
  }

  return (
    <VolumeCardView
      data={data}
      dimension={dimension}
      displayType={displayType}
      flowAnalysisPeriod={flowAnalysisPeriod}
      specsOnly={specsOnly}
    />
  );
};

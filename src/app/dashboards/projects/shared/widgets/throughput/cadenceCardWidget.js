import {Loading} from "../../../../../components/graphql/loading";
import React from "react";
import {getReferenceString} from "../../../../../helpers/utility";
import {useQueryDimensionFlowMetricsTrends} from "../../../../shared/widgets/work_items/hooks/useQueryDimensionFlowMetricsTrends";
import {logGraphQlError} from "../../../../../components/graphql/utils";
import {CadenceCardView} from "./throughputViews";

export const CadenceCardWidget = ({
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
    logGraphQlError("CadenceCardWidget.useQueryDimensionFlowMetricsTrends", error);
    return null;
  }

  return <CadenceCardView data={data} dimension={dimension} displayType={displayType} specsOnly={specsOnly} />;
};

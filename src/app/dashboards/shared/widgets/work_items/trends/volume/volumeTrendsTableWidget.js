import {Loading} from "../../../../../../components/graphql/loading";
import {logGraphQlError} from "../../../../../../components/graphql/utils";
import {getReferenceString} from "../../../../../../helpers/utility";
import {useQueryDimensionFlowMetricsTrends} from "../../hooks/useQueryDimensionFlowMetricsTrends";
import {VolumeTrendsTableView} from "./volumeTrendsTableView";

export function VolumeTrendsTableWidget({
  dimension,
  instanceKey,
  days,
  measurementWindow,
  samplingFrequency,
  targetPercentile,
  includeSubTasks,
  latestCommit,
  latestWorkItemEvent,
  view,
}) {
  const {loading, error, data} = useQueryDimensionFlowMetricsTrends({
    dimension,
    instanceKey,
    days,
    measurementWindow,
    samplingFrequency,
    targetPercentile,
    includeSubTasks,
    referenceString: getReferenceString(latestCommit, latestWorkItemEvent),
  });
  if (loading) return <Loading />;
  if (error) {
    logGraphQlError("DimensionPredictabilityTrendsWidget.useQueryDimensionFlowMetricsTrends", error);
    return null;
  }

  return (
    <VolumeTrendsTableView
      data={data}
      dimension={dimension}
      targetPercentile={targetPercentile}
      measurementWindow={measurementWindow}
      measurementPeriod={days}
      view={view}
    />
  );
}

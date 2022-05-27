import {Loading} from "../../../components/graphql/loading";
import {getReferenceString} from "../../../helpers/utility";
import {useQueryDimensionFlowMetrics} from "../../shared/widgets/work_items/closed/flowMetrics/useQueryDimensionFlowMetrics";
import {FlowInsights, ResponseTimeInsights} from "./metricHealthComponents";

export function ResponseTimeHealth({
  dimension,
  instanceKey,
  //   targets
  leadTimeTarget,
  cycleTimeTarget,
  leadTimeConfidenceTarget,
  cycleTimeConfidenceTarget,

  days,
  measurementWindow,
  samplingFrequency,

  specsOnly,
  includeSubTasks,
  latestWorkItemEvent,
  latestCommit,
}) {
  const {loading, error, data} = useQueryDimensionFlowMetrics({
    dimension,
    instanceKey,
    leadTimeTarget,
    cycleTimeTarget,
    leadTimeTargetPercentile: leadTimeConfidenceTarget,
    cycleTimeTargetPercentile: cycleTimeConfidenceTarget,
    days: days,
    measurementWindow: measurementWindow,
    samplingFrequency: samplingFrequency || 7,
    specsOnly: specsOnly,
    includeSubTasks: includeSubTasks,
    referenceString: getReferenceString(latestWorkItemEvent, latestCommit),
  });
  if (loading) return <Loading />;
  if (error) return null;
  const {
    cycleMetricsTrends: [current, prev],
  } = data[dimension];
  const [leadTimeValue, cycleTimeValue] = [current?.avgLeadTime, current?.avgCycleTime];

  return (
    <div>
      <ResponseTimeInsights
        title="Flow Insights"
        subTitle={`Last ${measurementWindow} days`}
        cycleTime={cycleTimeValue}
        leadTime={leadTimeValue}
        cycleTimeTarget={cycleTimeTarget}
        leadTimeTarget={leadTimeTarget}
      />
    </div>
  );
}

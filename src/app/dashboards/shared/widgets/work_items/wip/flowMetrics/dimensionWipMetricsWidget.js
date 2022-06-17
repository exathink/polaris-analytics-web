import React from "react";
import {Loading} from "../../../../../../components/graphql/loading";
import {useQueryDimensionPipelineCycleMetrics} from "../../hooks/useQueryDimensionPipelineCycleMetrics";
import {WorkInProgressSummaryView} from "./wipFlowMetricsSummaryView";
import {average, getReferenceString} from "../../../../../../helpers/utility";
import {useQueryDimensionPullRequests} from "../../../pullRequests/hooks/useQueryDimensionPullRequests";
import {useQueryDimensionPipelineStateDetails} from "../../hooks/useQueryDimensionPipelineStateDetails";
import {WorkItemStateTypes} from "../../../../config";
import {QuadrantSummaryPanel} from "../../../../charts/workItemCharts/quadrantSummaryPanel";
import {useQueryDimensionFlowMetrics} from "../../closed/flowMetrics/useQueryDimensionFlowMetrics";

function useQueryDimensionWipCombined({
  dimension,
  instanceKey,
  targetPercentile,
  leadTimeTargetPercentile,
  cycleTimeTargetPercentile,
  leadTimeTarget,
  cycleTimeTarget,
  days,
  specsOnly,
  includeSubTasks,
  latestWorkItemEvent,
  latestPullRequestEvent,
  latestCommit,
}) {
  const {
    loading,
    error,
    data: metricsData,
  } = useQueryDimensionPipelineCycleMetrics({
    dimension,
    instanceKey,
    targetPercentile,
    leadTimeTargetPercentile,
    cycleTimeTargetPercentile,
    specsOnly: specsOnly,
    includeSubTasks,
    referenceString: getReferenceString(latestWorkItemEvent, latestCommit),
  });

  const {
    loading: loading1,
    error: error1,
    data: pipelineData,
  } = useQueryDimensionPipelineStateDetails({
    dimension,
    instanceKey,
    specsOnly,
    activeOnly: true,
    includeSubTasks: includeSubTasks,
    referenceString: getReferenceString(latestWorkItemEvent, latestCommit),
  });

  const {
    loading: loading2,
    error: error2,
    data: prData,
  } = useQueryDimensionPullRequests({
    dimension,
    instanceKey,
    activeOnly: true,
    referenceString: getReferenceString(latestCommit, latestWorkItemEvent, latestPullRequestEvent),
  });

  const {loading: loading3, error: error3, data: flowMetricsData} = useQueryDimensionFlowMetrics({
    dimension,
    instanceKey,
    leadTimeTarget,
    cycleTimeTarget,
    leadTimeTargetPercentile,
    cycleTimeTargetPercentile,
    days: days,
    measurementWindow: days,
    samplingFrequency: days,
    specsOnly: specsOnly,
    includeSubTasks: includeSubTasks,
    referenceString: getReferenceString(latestWorkItemEvent, latestCommit),
  });

  return {
    loading: loading || loading1 || loading2 || loading3,
    error: error || error1 || error2 || error3,
    data: [metricsData, pipelineData, prData, flowMetricsData],
  };
}

export const DimensionWipMetricsWidget = ({
  dimension,
  instanceKey,
  specsOnly,
  days,
  latestCommit,
  latestWorkItemEvent,
  latestPullRequestEvent,
  leadTimeTarget,
  targetPercentile,
  leadTimeTargetPercentile,
  cycleTimeTargetPercentile,
  cycleTimeTarget,
  latencyTarget,
  view,
  includeSubTasks,
}) => {
  const {
    loading,
    error,
    data: [metricsData, pipelineData, prData, flowMetricsData],
  } = useQueryDimensionWipCombined({
    dimension,
    instanceKey,
    targetPercentile,
    leadTimeTargetPercentile,
    cycleTimeTargetPercentile,
    days,
    leadTimeTarget,
    cycleTimeTarget,
    specsOnly,
    includeSubTasks,
    latestWorkItemEvent,
    latestCommit,
    latestPullRequestEvent,
  });

  const workItems = React.useMemo(() => {
    const edges = pipelineData?.[dimension]?.["workItems"]?.["edges"] ?? [];
    return edges.map((edge) => edge.node);
  }, [pipelineData, dimension]);

  if (loading) return <Loading />;
  if (error) return null;

  const {cycleMetricsTrends: [current]} = flowMetricsData[dimension];
  const pullRequests = prData[dimension]["pullRequests"]["edges"].map((edge) => edge.node);
  const avgPullRequestsAge = average(pullRequests, (pullRequest) => pullRequest.age);
  const pipelineCycleMetrics = {
    ...metricsData[dimension]["pipelineCycleMetrics"],
    avgPullRequestsAge: avgPullRequestsAge,
    cycleTime: current["avgCycleTime"]
  };

  if (view === "primary") {
    return (
      <WorkInProgressSummaryView
        pipelineCycleMetrics={pipelineCycleMetrics}
        specsOnly={specsOnly}
        quadrantSummaryPanel={
          <QuadrantSummaryPanel
            workItems={workItems}
            stateTypes={[WorkItemStateTypes.open, WorkItemStateTypes.make, WorkItemStateTypes.deliver]}
            cycleTimeTarget={cycleTimeTarget}
            latencyTarget={latencyTarget || cycleTimeTarget}
            className="tw-mx-auto tw-w-[98%]"
          />
        }
      />
    );
  } else {
    return null;
  }
};

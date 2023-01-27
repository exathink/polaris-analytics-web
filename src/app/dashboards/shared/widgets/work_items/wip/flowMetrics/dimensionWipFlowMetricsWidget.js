import React from "react";
import {Loading} from "../../../../../../components/graphql/loading";
import {useQueryDimensionPipelineCycleMetrics} from "../../hooks/useQueryDimensionPipelineCycleMetrics";
import {WipFlowMetricsSummaryView} from "./wipFlowMetricsSummaryView";
import {average, getReferenceString} from "../../../../../../helpers/utility";
import {DimensionPipelineCycleTimeLatencyWidget} from "../cycleTimeLatency/dimensionPipelineCycleTimeLatencyWidget";
import {useChildState} from "../../../../../../helpers/hooksUtil";
import { useQueryDimensionPullRequests } from "../../../pullRequests/hooks/useQueryDimensionPullRequests";

export const DimensionWipFlowMetricsWidget = ({
  dimension,
  instanceKey,
  display,
  specsOnly,
  latestCommit,
  latestWorkItemEvent,
  latestPullRequestEvent,
  stateMappingIndex,
  days,
  targetPercentile,
  leadTimeTargetPercentile,
  cycleTimeTargetPercentile,
  cycleTimeTarget,
  latencyTarget,
  wipLimit,
  view,
  context,
  includeSubTasks,
  workItemScope: parentWorkItemScope,
  setWorkItemScope: parentSetWorkItemScope,
  pollInterval,
}) => {
  const limitToSpecsOnly = specsOnly != null ? specsOnly : true;
  const [workItemScope, setWorkItemScope] = useChildState(parentWorkItemScope, parentSetWorkItemScope, limitToSpecsOnly ? "specs" : "all");
  const {loading, error, data} = useQueryDimensionPipelineCycleMetrics({
    dimension,
    instanceKey,
    targetPercentile,
    leadTimeTargetPercentile,
    cycleTimeTargetPercentile,
    specsOnly: limitToSpecsOnly,
    includeSubTasks: includeSubTasks,
    referenceString: getReferenceString(latestWorkItemEvent, latestCommit),
  });
  
  const {loading: _loading, error: _error, data: prData} = useQueryDimensionPullRequests({
    dimension,
    instanceKey,
    activeOnly: true,
    referenceString: getReferenceString(latestCommit, latestWorkItemEvent, latestPullRequestEvent),
  });

  if (loading || _loading) return <Loading />;
  if (error || _error) return null;

  const pullRequests = prData[dimension]["pullRequests"]["edges"].map((edge) => edge.node);
  const avgPullRequestsAge = average(pullRequests, (pullRequest) => pullRequest.age);
  const pipelineCycleMetrics = {...data[dimension]["pipelineCycleMetrics"], avgPullRequestsAge: avgPullRequestsAge};

  if (view === "primary") {
    return (
      <WipFlowMetricsSummaryView
        pipelineCycleMetrics={pipelineCycleMetrics}
        display={display}
        latestCommit={latestCommit}
        targetPercentile={targetPercentile}
        leadTimeTargetPercentile={leadTimeTargetPercentile}
        cycleTimeTargetPercentile={cycleTimeTargetPercentile}
        cycleTimeTarget={cycleTimeTarget}
        wipLimit={wipLimit}
        specsOnly={limitToSpecsOnly}
      />
    );
  } else {
    return (
      <DimensionPipelineCycleTimeLatencyWidget
        queryVars={{
          dimension: dimension,
          instanceKey: instanceKey,
          specsOnly: workItemScope === "specs",
          activeOnly: true,
          includeSubTasks: includeSubTasks,
          referenceString: getReferenceString(latestWorkItemEvent, latestCommit),
        }}
        view={view}
        tooltipType="small"
        groupByState={true}
        cycleTimeTarget={cycleTimeTarget}
        latencyTarget={latencyTarget || cycleTimeTarget}
        context={context}
        targetPercentile={cycleTimeTargetPercentile}
        workItemScope={workItemScope}
        setWorkItemScope={setWorkItemScope}
      />
    );
  }
};


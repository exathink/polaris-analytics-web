import React from "react";
import {Loading} from "../../../../../../components/graphql/loading";
import {useQueryDimensionPipelineCycleMetrics} from "../../hooks/useQueryDimensionPipelineCycleMetrics";
import {WipFlowMetricsSummaryView, WorkInProgressSummaryView} from "./wipFlowMetricsSummaryView";
import {getReferenceString} from "../../../../../../helpers/utility";
import {DimensionPipelineCycleTimeLatencyWidget} from "../cycleTimeLatency/dimensionPipelineCycleTimeLatencyWidget";
import {useChildState} from "../../../../../../helpers/hooksUtil";

export const DimensionWipFlowMetricsWidget = ({
  dimension,
  instanceKey,
  newDesign,
  display,
  specsOnly,
  latestCommit,
  latestWorkItemEvent,
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
  if (loading) return <Loading />;
  if (error) return null;
  const pipelineCycleMetrics = data[dimension]["pipelineCycleMetrics"];

  if (view === "primary") {
    if (newDesign) {
      return (
        <WorkInProgressSummaryView
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
    }
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
        dimension={dimension}
        instanceKey={instanceKey}
        view={view}
        tooltipType="small"
        groupByState={true}
        cycleTimeTarget={cycleTimeTarget}
        latencyTarget={latencyTarget || cycleTimeTarget}
        context={context}
        latestWorkItemEvent={latestWorkItemEvent}
        latestCommit={latestCommit}
        targetPercentile={cycleTimeTargetPercentile}
        specsOnly={workItemScope === "specs"}
        includeSubTasks={includeSubTasks}
        workItemScope={workItemScope}
        setWorkItemScope={setWorkItemScope}
      />
    );
  }
};


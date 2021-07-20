import React from 'react';
import {Loading} from "../../../../../../components/graphql/loading";
import {DimensionWipFlowMetricsDetailDashboard} from "./dimensionWipFlowMetricsDetailDashboard"
import {useQueryDimensionPipelineCycleMetrics} from "../../hooks/useQueryDimensionPipelineCycleMetrics";
import {WipFlowMetricsSummaryView} from "./wipFlowMetricsSummaryView";
import {getReferenceString} from "../../../../../../helpers/utility";

export const DimensionWipFlowMetricsWidget = (
  {
    dimension,
    instanceKey,
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
    wipLimit,
    view,
    context,
    includeSubTasks,
    pollInterval
  }) => {
  const limitToSpecsOnly = specsOnly != null ? specsOnly : true;
  const {loading, error, data} = useQueryDimensionPipelineCycleMetrics(
    {
      dimension,
      instanceKey,
      targetPercentile,
      leadTimeTargetPercentile,
      cycleTimeTargetPercentile,
      specsOnly: limitToSpecsOnly,
      includeSubTasks: includeSubTasks,
      referenceString: getReferenceString(latestWorkItemEvent, latestCommit)
    }
  )
  if (loading) return <Loading/>;
  if (error) return null;
  const pipelineCycleMetrics = data[dimension]['pipelineCycleMetrics'];

  if (view === 'primary') {
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
    )
  } else {
    return (
      <DimensionWipFlowMetricsDetailDashboard
        dimension={dimension}
        instanceKey={instanceKey}
        latestWorkItemEvent={latestWorkItemEvent}
        stateMappingIndex={stateMappingIndex}
        days={days}
        targetPercentile={targetPercentile}
        leadTimeTargetPercentile={leadTimeTargetPercentile}
        cycleTimeTargetPercentile={cycleTimeTargetPercentile}
        specsOnly={limitToSpecsOnly}
        context={context}
        includeSubTasks={includeSubTasks}
      />
    )
  }

}


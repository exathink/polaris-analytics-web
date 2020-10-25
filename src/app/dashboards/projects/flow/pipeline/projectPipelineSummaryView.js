import React from 'react';
import {withNavigationContext} from "../../../../framework/navigation/components/withNavigationContext";
import {VizItem, VizRow} from "../../../shared/containers/layout";
import {
  PercentileCycleTime,
  CycleTimeCarousel,
  DurationCarousel,
  EffortCarousel,
  LatencyCarousel,
  LeadTimeCarousel,
  WipCarousel, Throughput, TotalEffort, AvgLatency, AvgDuration
} from "../../../shared/components/flowStatistics/flowStatistics";
import {PROJECTS_FLOWBOARD_20} from "../../../../../config/featureFlags";
import {withViewerContext} from "../../../../framework/viewer/viewerContext";

const FlowBoard20View = (
  {
    pipelineCycleMetrics,
    specsOnly,
    targetPercentile,
    leadTimeTargetPercentile,
    cycleTimeTargetPercentile,
    leadTimeTarget,
    cycleTimeTarget,
    viewerContext
  }
) => {
  return (
    <VizRow h={1}>

      <VizItem w={0.3}>
        <PercentileCycleTime
          currentMeasurement={pipelineCycleMetrics}
          targetPercentile={cycleTimeTargetPercentile}
          target={cycleTimeTarget}
        />
      </VizItem>
      <VizItem w={0.3}>
        <AvgDuration
          currentMeasurement={pipelineCycleMetrics}
          target={cycleTimeTarget}
        />
      </VizItem>
      <VizItem w={0.3} style={{
        paddingLeft: '40px',
        borderLeftWidth: '1px',
        borderLeftStyle: 'solid',
        borderLeftColor: 'rgba(0,0,0,0.1)',
        paddingRight: '40px',
        borderRightWidth: '1px',
        borderRightStyle: 'solid',
        borderRightColor: 'rgba(0,0,0,0.1)'
      }}>
        <Throughput
          title={'Wip'}
          currentMeasurement={pipelineCycleMetrics}
          specsOnly={specsOnly}
        />
      </VizItem>
      <VizItem w={0.3}>
        <TotalEffort
          currentMeasurement={pipelineCycleMetrics}
        />
      </VizItem>

    </VizRow>
  )
}

const NonFlowBoard20View = (
  {
    pipelineCycleMetrics,
    specsOnly,
    targetPercentile,
    leadTimeTargetPercentile,
    cycleTimeTargetPercentile,
    leadTimeTarget,
    cycleTimeTarget,
    viewerContext
  }
) => {

  return (
    <VizRow h={1}>
      <VizItem w={0.4}>
        <WipCarousel
          currentMeasurement={pipelineCycleMetrics}
          specsOnly={specsOnly}
        />
      </VizItem>
      <VizItem w={0.6}>
        <CycleTimeCarousel
          currentMeasurement={pipelineCycleMetrics}
          targetPercentile={cycleTimeTargetPercentile || targetPercentile}
          target={cycleTimeTarget}
        />
      </VizItem>
    </VizRow>
  )
}

const PipelineSummaryView = withViewerContext((
  {
    pipelineCycleMetrics,
    specsOnly,
    targetPercentile,
    leadTimeTargetPercentile,
    cycleTimeTargetPercentile,
    leadTimeTarget,
    cycleTimeTarget,
    viewerContext
  }
) => (
  viewerContext.isFeatureFlagActive(PROJECTS_FLOWBOARD_20) ?
    <FlowBoard20View
      {
        ...{
          pipelineCycleMetrics,
          specsOnly,
          targetPercentile,
          leadTimeTargetPercentile,
          cycleTimeTargetPercentile,
          leadTimeTarget,
          cycleTimeTarget,
          viewerContext
        }
      }/> :
    <NonFlowBoard20View
      {
        ...{
          pipelineCycleMetrics,
          specsOnly,
          targetPercentile,
          leadTimeTargetPercentile,
          cycleTimeTargetPercentile,
          leadTimeTarget,
          cycleTimeTarget,
          viewerContext
        }
      }/>

));


export const ProjectPipelineSummaryView = withNavigationContext(PipelineSummaryView);






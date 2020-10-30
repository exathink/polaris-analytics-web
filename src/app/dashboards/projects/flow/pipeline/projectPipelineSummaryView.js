import React from 'react';
import {withNavigationContext} from "../../../../framework/navigation/components/withNavigationContext";
import {VizItem, VizRow} from "../../../shared/containers/layout";
import {
  AvgDuration,
  CycleTimeCarousel,
  PercentileCycleTime,
  Throughput,
  TotalEffort,
  WipCarousel,
  Wip, LatestClosed, Cadence, AvgCycleTime, AvgLatency, LatestCommit, WipWithLimit
} from "../../../shared/components/flowStatistics/flowStatistics";
import {PROJECTS_FLOWBOARD_20} from "../../../../../config/featureFlags";
import {withViewerContext} from "../../../../framework/viewer/viewerContext";
import {ComponentCarousel} from "../../../shared/components/componentCarousel/componentCarousel";
import {CycleMetricsCarouselView} from "../flowMetrics/projectAggregateFlowMetricsView";

const FlowBoardSummaryView = (
  {
    pipelineCycleMetrics,
    specsOnly,
    targetPercentile,
    leadTimeTargetPercentile,
    cycleTimeTargetPercentile,
    leadTimeTarget,
    cycleTimeTarget,
    wipLimit,
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
      }}>
        <WipWithLimit
          currentMeasurement={pipelineCycleMetrics}
          target={wipLimit}
          specsOnly={specsOnly}
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

export const ValueBoardSummaryView = (
  {

    pipelineCycleMetrics,

    latestCommit,
    leadTimeTargetPercentile,
    cycleTimeTargetPercentile,
    leadTimeTarget,
    cycleTimeTarget,
    wipLimit,
    specsOnly,

  }
) => {
  const current = pipelineCycleMetrics;

  return (
    <div>
      <VizRow h={"50"}>
        <VizItem w={1 / 3}>
          <Wip
            currentMeasurement={current}
            target={wipLimit}
            specsOnly={specsOnly}
          />
        </VizItem>
        <VizItem w={1 / 3}>
          <AvgCycleTime
            currentMeasurement={current}

            target={cycleTimeTarget}
          />
        </VizItem>
        <VizItem w={1 / 3}>
          <LatestCommit
            latestCommit={latestCommit}
          />
        </VizItem>
      </VizRow>
      <VizRow h={"50%"}
              style={{
                paddingTop: '20px',
                borderTop: '1px',
                borderTopStyle: 'solid',
                borderTopColor: 'rgba(0,0,0,0.1)'
              }}>
        <VizItem w={1 / 3}>
          <TotalEffort
            currentMeasurement={current}

          />
        </VizItem>
        <VizItem w={1 / 3}>
          <AvgDuration
            currentMeasurement={current}

            target={cycleTimeTarget}
          />
        </VizItem>
        <VizItem w={1 / 3}>
          <AvgLatency
            title={'Latency'}
            currentMeasurement={current}

            target={cycleTimeTarget}
          />
        </VizItem>
      </VizRow>
    </div>
  )
};

const PipelineSummaryView = withViewerContext((
  {
    pipelineCycleMetrics,
    display,
    specsOnly,
    latestCommit,
    targetPercentile,
    leadTimeTargetPercentile,
    cycleTimeTargetPercentile,
    leadTimeTarget,
    cycleTimeTarget,
    wipLimit,
    viewerContext
  }
) => {

  switch (display) {
    case 'flowboardSummary':
      return (
        <FlowBoardSummaryView
          {
            ...{
              pipelineCycleMetrics,
              specsOnly,
              targetPercentile,
              leadTimeTargetPercentile,
              cycleTimeTargetPercentile,
              leadTimeTarget,
              cycleTimeTarget,
              wipLimit,
              viewerContext
            }
          }/>
      )
    case 'valueBoardSummary':
      return (
        <ValueBoardSummaryView
          {
            ...{
              pipelineCycleMetrics,
              latestCommit,
              specsOnly,
              targetPercentile,
              leadTimeTargetPercentile,
              cycleTimeTargetPercentile,
              leadTimeTarget,
              cycleTimeTarget,
              wipLimit,
              viewerContext
            }
          }/>
      )
    default:
      return (
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
              wipLimit,
              viewerContext
            }
          }
        />
      )
  }
});


export const ProjectPipelineSummaryView = withNavigationContext(PipelineSummaryView);






import React from "react";
import {withNavigationContext} from "../../../../../../framework/navigation/components/withNavigationContext";
import {VizItem, VizRow} from "../../../../containers/layout";
import {
  AvgCycleTime,
  AvgDuration,
  AvgLatency,
  CycleTimeCarousel,
  EffortWIP,
  LatestCommit,
  PercentileCycleTime,
  Wip,
  WipCarousel,
  WipWithLimit,
} from "../../../../components/flowStatistics/flowStatistics";
import {withViewerContext} from "../../../../../../framework/viewer/viewerContext";
import {ComponentCarousel} from "../../../../components/componentCarousel/componentCarousel";
import styles from "../../../../../projects/shared/widgets/wip/wip.module.css";

const FlowBoardSummaryView = ({
  pipelineCycleMetrics,
  specsOnly,
  targetPercentile,
  leadTimeTargetPercentile,
  cycleTimeTargetPercentile,
  leadTimeTarget,
  cycleTimeTarget,
  wipLimit,
  viewerContext,
}) => {
  return (
    <div className={styles.boxWrapper}>
      <div >
        <PercentileCycleTime
          currentMeasurement={pipelineCycleMetrics}
          targetPercentile={cycleTimeTargetPercentile}
          target={cycleTimeTarget}
        />
      </div>
      <div >
        <ComponentCarousel tickInterval={2000}>
          <AvgCycleTime currentMeasurement={pipelineCycleMetrics} target={cycleTimeTarget} />
          <AvgDuration currentMeasurement={pipelineCycleMetrics} target={cycleTimeTarget} />
        </ComponentCarousel>
      </div>
      <div
        
        style={{
          paddingLeft: "40px",
          borderLeftWidth: "1px",
          borderLeftStyle: "solid",
          borderLeftColor: "rgba(0,0,0,0.1)",
        }}
      >
        <WipWithLimit currentMeasurement={pipelineCycleMetrics} target={wipLimit} specsOnly={specsOnly} />
      </div>
    </div>
  );
};

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
          <EffortWIP
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


export const ProjectWipFlowMetricsSummaryView = withNavigationContext(PipelineSummaryView);






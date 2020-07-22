import React from "react";
import {VizItem, VizRow} from "../../../shared/containers/layout";
import {
  Statistic,
  TrendIndicator,
  TrendIndicatorDisplayThreshold
} from "../../../../../app/components/misc/statistic/statistic";
import {percentileToText} from "../../../../helpers/utility";
import {withViewerContext} from "../../../../framework/viewer/viewerContext";

export const ProjectAggregateFlowMetricsView = withViewerContext((
  {
    showAll,
    targetPercentile,
    currentCycleMetrics,
    previousCycleMetrics,
    stateMappingIndex,
    viewerContext
  }
  ) => {
    const trendIndicatorThreshold = viewerContext.trendIndicatorThreshold || TrendIndicatorDisplayThreshold;
    return (
      stateMappingIndex.isValid() ?
        <React.Fragment>
          {
            !showAll ?
              <VizRow h={"80%"}>
                <VizItem w={0.30}>
                  <Statistic
                    title="Throughput"
                    value={currentCycleMetrics.workItemsWithCommits || 0}
                    precision={0}
                    valueStyle={{color: '#3f8600'}}
                    prefix={
                      <TrendIndicator
                        firstValue={currentCycleMetrics.workItemsWithCommits}
                        secondValue={previousCycleMetrics.workItemsWithCommits}
                        good={TrendIndicator.isPositive}
                        deltaThreshold={trendIndicatorThreshold}
                      />
                    }
                    suffix={"Specs"}
                  />
                </VizItem>
                <VizItem w={0.40}>
                  <Statistic
                    title={<span>Lead Time <sup>{`${percentileToText(targetPercentile)}`}</sup> </span>}
                    value={currentCycleMetrics.percentileLeadTime || 0}
                    precision={1}
                    valueStyle={{color: '#3f8600'}}
                    prefix={
                      <TrendIndicator
                        firstValue={currentCycleMetrics.percentileLeadTime}
                        secondValue={previousCycleMetrics.percentileLeadTime}
                        good={TrendIndicator.isNegative}
                        deltaThreshold={trendIndicatorThreshold}
                      />
                    }
                    suffix={"Days"}
                  />
                </VizItem>
                <VizItem w={0.35}>
                  {
                    stateMappingIndex.numInProcessStates() > 0 ?
                      <Statistic
                        title={<span>Cycle Time <sup>Avg</sup></span>}
                        value={currentCycleMetrics.avgCycleTime || 0}
                        precision={1}
                        valueStyle={{color: '#3f8600'}}
                        prefix={
                          <TrendIndicator
                            firstValue={currentCycleMetrics.avgCycleTime}
                            secondValue={previousCycleMetrics.avgCycleTime}
                            good={TrendIndicator.isNegative}
                            deltaThreshold={trendIndicatorThreshold}
                          />
                        }
                        suffix={"Days"}
                      />
                      :
                      <Statistic
                        title={<span>Lead Time <sup>Avg</sup></span>}
                        value={currentCycleMetrics.avgLeadTime || 0}
                        precision={1}
                        valueStyle={{color: '#3f8600'}}
                        prefix={
                          <TrendIndicator
                            firstValue={currentCycleMetrics.avgLeadTime}
                            secondValue={previousCycleMetrics.avgLeadTime}
                            good={TrendIndicator.isNegative}
                            deltaThreshold={trendIndicatorThreshold}
                          />
                        }
                        suffix={"Days"}
                      />

                  }
                </VizItem>
              </VizRow>
              :
              <VizRow h={"80%"}>
                <VizItem>
                  <Statistic
                    title="Throughput"
                    value={currentCycleMetrics.workItemsWithCommits || 0}
                    precision={0}
                    valueStyle={{color: '#3f8600'}}
                    prefix={
                      <TrendIndicator
                        firstValue={currentCycleMetrics.workItemsWithCommits}
                        secondValue={previousCycleMetrics.workItemsWithCommits}
                        good={TrendIndicator.isPositive}
                        deltaThreshold={trendIndicatorThreshold}
                      />
                    }
                    suffix={"Work Items"}
                  />
                </VizItem>
                {
                  stateMappingIndex.numInProcessStates() > 0 &&
                  <VizItem>
                    <Statistic
                      title={<span>Lead Time <sup>{`Avg`}</sup> </span>}
                      value={currentCycleMetrics.avgLeadTime || 0}
                      precision={1}
                      valueStyle={{color: '#3f8600'}}
                      prefix={
                        <TrendIndicator
                          firstValue={currentCycleMetrics.avgLeadTime}
                          secondValue={previousCycleMetrics.avgLeadTime}
                          good={TrendIndicator.isNegative}
                          deltaThreshold={trendIndicatorThreshold}
                        />
                      }
                      suffix={"Days"}
                    />
                  </VizItem>
                }
                <VizItem>
                  <Statistic
                    title={<span>Lead Time <sup>{`${percentileToText(targetPercentile)}`}</sup> </span>}
                    value={currentCycleMetrics.percentileLeadTime || 0}
                    precision={1}
                    valueStyle={{color: '#3f8600'}}
                    prefix={
                      <TrendIndicator
                        firstValue={currentCycleMetrics.percentileLeadTime}
                        secondValue={previousCycleMetrics.percentileLeadTime}
                        good={TrendIndicator.isNegative}
                        deltaThreshold={trendIndicatorThreshold}
                      />
                    }
                    suffix={"Days"}
                  />
                </VizItem>
                <VizItem>
                  <Statistic
                    title={<span>Lead Time <sup>{`Max`}</sup> </span>}
                    value={currentCycleMetrics.maxLeadTime || 0}
                    precision={1}
                    valueStyle={{color: '#3f8600'}}
                    prefix={
                      <TrendIndicator
                        firstValue={currentCycleMetrics.maxLeadTime}
                        secondValue={previousCycleMetrics.maxLeadTime}
                        good={TrendIndicator.isNegative}
                        deltaThreshold={trendIndicatorThreshold}
                      />
                    }
                    suffix={"Days"}
                  />
                </VizItem>
                <VizItem>
                  {
                    stateMappingIndex.numInProcessStates() > 0 ?
                      <Statistic
                        title={<span>Cycle Time <sup>Avg</sup></span>}
                        value={currentCycleMetrics.avgCycleTime || 0}
                        precision={1}
                        valueStyle={{color: '#3f8600'}}
                        prefix={
                          <TrendIndicator
                            firstValue={currentCycleMetrics.avgCycleTime}
                            secondValue={previousCycleMetrics.avgCycleTime}
                            good={TrendIndicator.isNegative}
                            deltaThreshold={trendIndicatorThreshold}
                          />
                        }
                        suffix={"Days"}
                      />
                      :
                      <Statistic
                        title={<span>Lead Time <sup>Avg</sup></span>}
                        value={currentCycleMetrics.avgLeadTime || 0}
                        precision={1}
                        valueStyle={{color: '#3f8600'}}
                        prefix={
                          <TrendIndicator
                            firstValue={currentCycleMetrics.avgLeadTime}
                            secondValue={previousCycleMetrics.avgLeadTime}
                            good={TrendIndicator.isNegative}
                            deltaThreshold={trendIndicatorThreshold}
                          />
                        }
                        suffix={"Days"}
                      />

                  }
                </VizItem>
                {
                  stateMappingIndex.numInProcessStates() > 0 &&
                  <VizItem>
                    <Statistic
                      title={<span>Cycle Time <sup>{`${percentileToText(targetPercentile)}`}</sup> </span>}
                      value={currentCycleMetrics.percentileCycleTime || 0}
                      precision={1}
                      valueStyle={{color: '#3f8600'}}
                      prefix={
                        <TrendIndicator
                          firstValue={currentCycleMetrics.percentileCycleTime}
                          secondValue={previousCycleMetrics.percentileCycleTime}
                          good={TrendIndicator.isNegative}
                          deltaThreshold={trendIndicatorThreshold}
                        />
                      }
                      suffix={"Days"}
                    />
                  </VizItem>
                }
                {
                  stateMappingIndex.numInProcessStates() > 0 &&
                  <VizItem>
                    <Statistic
                      title={<span>Cycle Time <sup>{`Max`}</sup> </span>}
                      value={currentCycleMetrics.maxCycleTime || 0}
                      precision={1}
                      valueStyle={{color: '#3f8600'}}
                      prefix={
                        <TrendIndicator
                          firstValue={currentCycleMetrics.maxCycleTime}
                          secondValue={previousCycleMetrics.maxCycleTime}
                          good={TrendIndicator.isNegative}
                          deltaThreshold={trendIndicatorThreshold}
                        />
                      }
                      suffix={"Days"}
                    />
                  </VizItem>
                }
              </VizRow>

          }
        </React.Fragment>
        :
        null
    )
  }
);
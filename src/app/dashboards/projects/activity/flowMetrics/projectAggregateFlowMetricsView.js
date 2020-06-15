import React from "react";
import {VizItem, VizRow} from "../../../shared/containers/layout";
import {Statistic} from "../../../../../app/components/misc/statistic/statistic";
import {percentileToText} from "../../../../helpers/utility";

export const ProjectAggregateFlowMetricsView = (
  {
    showAll,
    percentileLeadTime,
    avgLeadTime,
    maxLeadTime,
    avgCycleTime,
    percentileCycleTime,
    maxCycleTime,

    workItemsInScope,
    targetPercentile,
    stateMappingIndex,
  }
) => (
  stateMappingIndex.isValid() ?
    <React.Fragment>
      {
        !showAll ?
          <VizRow h={"80%"}>
            <VizItem w={0.30}>
              <Statistic
                title="Throughput"
                value={workItemsInScope || 0}
                precision={0}
                valueStyle={{color: '#3f8600'}}

                suffix={"Work Items"}
              />
            </VizItem>
            <VizItem w={0.40}>
              <Statistic
                title={<span>Lead Time <sup>{`${percentileToText(targetPercentile)}`}</sup> </span>}
                value={percentileLeadTime || 0}
                precision={1}
                valueStyle={{color: '#3f8600'}}

                suffix={"Days"}
              />
            </VizItem>
            <VizItem w={0.35}>
              {
                stateMappingIndex.numInProcessStates() > 0 ?
                  <Statistic
                    title={<span>Cycle Time <sup>Avg</sup></span>}
                    value={avgCycleTime || 0}
                    precision={1}
                    valueStyle={{color: '#3f8600'}}

                    suffix={"Days"}
                  />
                  :
                  <Statistic
                    title={<span>Lead Time <sup>Avg</sup></span>}
                    value={avgLeadTime || 0}
                    precision={1}
                    valueStyle={{color: '#3f8600'}}

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
                value={workItemsInScope || 0}
                precision={0}
                valueStyle={{color: '#3f8600'}}

                suffix={"Work Items"}
              />
            </VizItem>
            {
              stateMappingIndex.numInProcessStates() > 0 &&
              <VizItem>
                <Statistic
                  title={<span>Lead Time <sup>{`Avg`}</sup> </span>}
                  value={avgLeadTime || 0}
                  precision={1}
                  valueStyle={{color: '#3f8600'}}

                  suffix={"Days"}
                />
              </VizItem>
            }
            <VizItem>
              <Statistic
                title={<span>Lead Time <sup>{`${percentileToText(targetPercentile)}`}</sup> </span>}
                value={percentileLeadTime || 0}
                precision={1}
                valueStyle={{color: '#3f8600'}}

                suffix={"Days"}
              />
            </VizItem>
            <VizItem>
              <Statistic
                title={<span>Lead Time <sup>{`Max`}</sup> </span>}
                value={maxLeadTime || 0}
                precision={1}
                valueStyle={{color: '#3f8600'}}

                suffix={"Days"}
              />
            </VizItem>
            <VizItem>
              {
                stateMappingIndex.numInProcessStates() > 0 ?
                  <Statistic
                    title={<span>Cycle Time <sup>Avg</sup></span>}
                    value={avgCycleTime || 0}
                    precision={1}
                    valueStyle={{color: '#3f8600'}}

                    suffix={"Days"}
                  />
                  :
                  <Statistic
                    title={<span>Lead Time <sup>Avg</sup></span>}
                    value={avgLeadTime || 0}
                    precision={1}
                    valueStyle={{color: '#3f8600'}}

                    suffix={"Days"}
                  />

              }
            </VizItem>
            {
              stateMappingIndex.numInProcessStates() > 0 &&
              <VizItem>
                <Statistic
                  title={<span>Cycle Time <sup>{`${percentileToText(targetPercentile)}`}</sup> </span>}
                  value={percentileCycleTime || 0}
                  precision={1}
                  valueStyle={{color: '#3f8600'}}

                  suffix={"Days"}
                />
              </VizItem>
            }
            {
              stateMappingIndex.numInProcessStates() > 0 &&
              <VizItem>
                <Statistic
                  title={<span>Cycle Time <sup>{`Max`}</sup> </span>}
                  value={maxCycleTime || 0}
                  precision={1}
                  valueStyle={{color: '#3f8600'}}

                  suffix={"Days"}
                />
              </VizItem>
            }
          </VizRow>

      }
    </React.Fragment>
    :
    null
);
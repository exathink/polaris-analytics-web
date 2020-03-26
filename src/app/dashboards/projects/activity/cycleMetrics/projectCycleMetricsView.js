import React from "react";
import {VizItem, VizRow} from "../../../shared/containers/layout";
import {Statistic} from "../../../../../app/components/misc/statistic/statistic";
import {percentileToText} from "../../../../helpers/utility";

export const ProjectCycleMetricsView = (
  {
    percentileLeadTime,
    avgLeadTime,
    avgCycleTime,
    workItemsInScope,
    targetPercentile
  }
  ) => (
  <React.Fragment>
      <VizRow h={"100%"}>
        <VizItem w={0.25}>
          <Statistic
            title="Throughput"
            value={workItemsInScope || 0}
            precision={0}
            valueStyle={{ color: '#3f8600'}}
            style={{backgroundColor: '#f2f3f6'}}
            suffix={"Work Items"}
          />
        </VizItem>
        <VizItem w={0.35}>
          <Statistic
            title={<span>Lead Time <sup>{`${percentileToText(targetPercentile)}`}</sup> </span>}
            value={percentileLeadTime || 0}
            precision={1}
            valueStyle={{ color: '#3f8600'}}
            style={{backgroundColor: '#f2f3f6'}}
            suffix={"Days"}
          />
        </VizItem>
        <VizItem w={0.3}>
          {
            avgCycleTime > 0 ?
              <Statistic
                title={<span>Cycle Time <sup>Avg</sup></span>}
                value={avgCycleTime || 0}
                precision={1}
                valueStyle={{color: '#3f8600'}}
                style={{backgroundColor: '#f2f3f6'}}
                suffix={"Days"}
              />
              :
              <Statistic
                title={<span>Lead Time <sup>Avg</sup></span>}
                value={avgLeadTime || 0}
                precision={1}
                valueStyle={{color: '#3f8600'}}
                style={{backgroundColor: '#f2f3f6'}}
                suffix={"Days"}
              />

          }
        </VizItem>
      </VizRow>
    </React.Fragment>
);
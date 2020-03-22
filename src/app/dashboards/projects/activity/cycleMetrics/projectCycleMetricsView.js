import React from "react";
import {VizItem, VizRow} from "../../../shared/containers/layout";
import {Statistic} from "antd";
import {Tooltip} from "antd";
import {percentileToText} from "../../../../helpers/utility";

export const ProjectCycleMetricsView = (
  {
    percentileLeadTime,
    percentileCycleTime,
    workItemsInScope,
    targetPercentile
  }
  ) => (
  <React.Fragment>
      <VizRow h={"100%"}>
        <VizItem w={0.3}>
          <Statistic
            title={<Tooltip title={`${percentileToText(targetPercentile)}`}><span>Lead Time</span></Tooltip> }
            value={percentileLeadTime || 0}
            precision={1}
            valueStyle={{ color: '#3f8600'}}
            style={{backgroundColor: '#f2f3f6'}}
            suffix={"Days"}
          />
        </VizItem>
        <VizItem w={0.3}>
          <Statistic
            title={<Tooltip title={`${percentileToText(targetPercentile)}`}><span>Cycle Time</span></Tooltip> }
            value={percentileCycleTime || 0}
            precision={1}
            valueStyle={{ color: '#3f8600'}}
            style={{backgroundColor: '#f2f3f6'}}
            suffix={"Days"}
          />
        </VizItem>
        <VizItem w={0.3}>
          <Statistic
            title="Throughput"
            value={workItemsInScope || 0}
            precision={0}
            valueStyle={{ color: '#3f8600'}}
            style={{backgroundColor: '#f2f3f6'}}
            suffix={"Work Items"}
          />
        </VizItem>
      </VizRow>
    </React.Fragment>
);
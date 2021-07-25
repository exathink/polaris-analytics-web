import React from "react";
import {VizItem, VizRow} from "../../../shared/containers/layout";
import {Statistic} from "antd";
import {getCycleMetrics} from "../../../shared/widgets/work_items/clientSideFlowMetrics";

export const WorkItemFlowMetricsView = ({workItem, context, view}) => {
  const [leadTime, cycleTime] = getCycleMetrics(workItem);
  return (
    <React.Fragment>
      <VizRow h={"100%"}>
        <VizItem w={1 / 2}>
          <Statistic
            title={<span>Lead Time {workItem.stateType !== "closed" && <sup>{`Current`}</sup>} </span>}
            value={leadTime || 0}
            precision={1}
            valueStyle={{color: "#3f8600"}}
            style={{backgroundColor: "#f2f3f6"}}
            suffix={"Days"}
          />
        </VizItem>
        <VizItem w={1 / 2}>
          <Statistic
            title={<span>{workItem.stateType !== "closed" ? "Age" : "Cycle Time"} </span>}
            value={cycleTime || 0}
            precision={1}
            valueStyle={{color: "#3f8600"}}
            style={{backgroundColor: "#f2f3f6"}}
            suffix={"Days"}
          />
        </VizItem>
      </VizRow>
    </React.Fragment>
  );
};


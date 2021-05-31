import React from 'react';
import {VizItem, VizRow} from "../../../shared/containers/layout";
import {daysFromNow, toMoment} from "../../../../helpers/utility";
import {Statistic} from "antd";

function getCycleMetrics(workItem) {
  /* TODO: It is kind of messy that we  have to do this calculation here but
  *   it is probably the most straightfoward way to do it given that this is
  * a calc that only applies to the current delivery cycle
  * We are duplicating logic that is also done on the backend for closed cycles,
  * */
  if (workItem.stateType !== 'closed') {
    const durations = workItem.workItemStateDetails.currentDeliveryCycleDurations;
    let leadTime = 0;
    let cycleTime = 0;
    for (let i = 0; i < durations.length; i++) {
      leadTime = leadTime + durations[i].daysInState;
      if (durations[i].stateType !== 'backlog') {
        cycleTime = cycleTime + durations[i].daysInState;
      }
    }
    const timeInCurrentState = daysFromNow(toMoment(workItem.workItemStateDetails.currentStateTransition.eventDate))
    return [leadTime + timeInCurrentState, cycleTime + timeInCurrentState]
  } else {
    // for closed work items we can get the correct cycle time from the back end.
    return [workItem.workItemStateDetails.leadTime, workItem.workItemStateDetails.cycleTime]
  }
}

export const WorkItemFlowMetricsView = ({workItem, context, view}) => {
  const [leadTime, cycleTime] = getCycleMetrics(workItem);
  return (
    <React.Fragment>
      <VizRow h={"100%"}>
        <VizItem w={1 / 2}>
          <Statistic
            title={<span>Lead Time {workItem.stateType !== 'closed' && <sup>{`Min`}</sup>} </span>}
            value={leadTime || 0}
            precision={1}
            valueStyle={{color: '#3f8600'}}
            style={{backgroundColor: '#f2f3f6'}}
            suffix={"Days"}
          />
        </VizItem>
        <VizItem w={1 / 2}>
          <Statistic
            title={<span>Cycle Time {workItem.stateType !== 'closed' && <sup>{`Min`}</sup>} </span>}
            value={cycleTime || 0}
            precision={1}
            valueStyle={{color: '#3f8600'}}
            style={{backgroundColor: '#f2f3f6'}}
            suffix={"Days"}
          />
        </VizItem>
      </VizRow>
    </React.Fragment>
  )
};


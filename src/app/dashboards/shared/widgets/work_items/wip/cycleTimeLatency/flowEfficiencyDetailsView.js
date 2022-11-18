import {useFlowEfficiency} from "../../../../../projects/shared/helper/hooks";
import {WorkItemsAggregateDurationsByStateChart} from "../../../../charts/workItemCharts/workItemsAggregateDurationsByStateChart";
import {AvgFlowType} from "../../../../components/flowStatistics/flowStatistics";

export function FlowEfficiencyDetailsView({workItems}) {
  const {totalTimeInActiveStates, totalTimeInWaitStates} = useFlowEfficiency(workItems);
  const avgActiveTime = workItems.length > 0 ? totalTimeInActiveStates / workItems.length : 0;
  const avgWaitTime = workItems.length > 0 ? totalTimeInWaitStates / workItems.length : 0;

  return (
    <div className="tw-grid tw-h-[450px] tw-w-[500px] tw-grid-cols-2 tw-grid-rows-[30%_70%] tw-gap-2">
      <div className="active_time_avg_card1 tw-col-start-1 tw-row-start-1 tw-p-2">
        <AvgFlowType title={<span className="tw-text-green-400">Avg Active Time</span>} value={avgActiveTime} />
      </div>
      <div className="wait_time_avg_card2 tw-col-start-2 tw-row-start-1 tw-p-2">
        <AvgFlowType title={<span>Avg Wait Time</span>} value={avgWaitTime} />
      </div>
      <div className="chart tw-col-span-2 tw-row-start-2 tw-p-2">
        <WorkItemsAggregateDurationsByStateChart workItems={workItems} title="Time spent by state" />
      </div>
    </div>
  );
}

import {WorkItemsAggregateDurationsByStateChart} from "../../../../charts/workItemCharts/workItemsAggregateDurationsByStateChart";

export function FlowEfficiencyDetailsView({workItems}) {
  return (
    <div className="tw-grid tw-h-[450px] tw-w-[500px] tw-grid-cols-2 tw-grid-rows-[30%_70%] tw-gap-2">
      <div className="active_time_avg_card1 tw-col-start-1 tw-row-start-1 tw-border tw-border-solid tw-border-gray-200 tw-p-2">
        First Card
      </div>
      <div className="wait_time_avg_card2 tw-col-start-2 tw-row-start-1 tw-border tw-border-solid tw-border-gray-200 tw-p-2">
        Second Card
      </div>
      <div
        className="chart tw-col-span-2 tw-row-start-2 tw-border tw-border-solid tw-border-gray-200 tw-p-2"
      >
        <WorkItemsAggregateDurationsByStateChart workItems={workItems} title="Testing" />
      </div>
    </div>
  );
}

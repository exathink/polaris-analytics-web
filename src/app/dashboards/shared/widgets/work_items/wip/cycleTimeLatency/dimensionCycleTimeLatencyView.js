import React from "react";
import {VizItem, VizRow} from "../../../../containers/layout";
import { FlowEfficiencyQuadrantSummaryCard } from "./flowEfficiencyQuadrantSummaryCard";
import { QuadrantSummaryPanel } from "../../../../charts/workItemCharts/quadrantSummaryPanel";
import {WorkItemsDetailHistogramChart} from "../../../../charts/workItemCharts/workItemsDetailHistorgramChart";
import { getWorkItemDurations } from "../../clientSideFlowMetrics";
import { AppTerms } from "../../../../config";
import { useIntl } from "react-intl";
import {localNow} from "../../../../../../helpers/utility";
import { useCycleTimeLatencyHook, getSubTitleForHistogram } from "./cycleTimeLatencyUtils";

const COL_WIDTH_BOUNDARIES = [1, 3, 7, 14, 30, 60, 90];

export function getSubTitle({workItems, specsOnly, intl}) {
  const count = workItems.length;

  const countDisplay = `${count} ${
    count === 1
      ? specsOnly
        ? AppTerms.spec.display
        : AppTerms.card.display
      : specsOnly
      ? AppTerms.specs.display
      : AppTerms.cards.display
  }`;

  return `${countDisplay} as of ${localNow(intl)}`;
}

export const DimensionCycleTimeLatencyView = ({
  dimension,
  stageName,
  data,
  stateTypes,
  groupByState,
  cycleTimeTarget,
  latencyTarget,
  specsOnly,
  tooltipType,
  view,
  context,
  displayBag={}
}) => {
  const intl = useIntl();

  const workItems = React.useMemo(() => {
    const edges = data?.[dimension]?.["workItems"]?.["edges"] ?? [];
    return edges.map((edge) => edge.node);
  }, [data, dimension]);

  const workItemsWithAggregateDurations = getWorkItemDurations(workItems).filter((workItem) =>
    stateTypes != null ? stateTypes.indexOf(workItem.stateType) !== -1 : true
  );
 
  const seriesData = useCycleTimeLatencyHook(workItemsWithAggregateDurations);

  return (
    <VizRow h={1}>
      <VizItem w={1}>
        <div className="tw-h-[77%]">
          <WorkItemsDetailHistogramChart
            chartConfig={{
              title: `Age Distribution: ${stageName}`,
              subtitle: getSubTitleForHistogram({workItems: workItemsWithAggregateDurations, specsOnly, intl}),
              xAxisTitle: "Age in Days",
            }}
            selectedMetric={"age"}
            specsOnly={specsOnly}
            colWidthBoundaries={COL_WIDTH_BOUNDARIES}
            stateType={"deliver"}
            series={seriesData}
          />
        </div>
        <div className={`tw-flex tw-h-[23%] tw-items-center tw-bg-chart`}>
          {displayBag?.displayType === "FlowEfficiencyCard" ? (
            <FlowEfficiencyQuadrantSummaryCard
              workItems={workItems}
              stateTypes={stateTypes}
              specsOnly={specsOnly}
              cycleTimeTarget={cycleTimeTarget}
              latencyTarget={latencyTarget}
              className="tw-mx-auto tw-w-[98%]"
            />
          ) : (
            <QuadrantSummaryPanel
              workItems={workItems}
              stateTypes={stateTypes}
              cycleTimeTarget={cycleTimeTarget}
              latencyTarget={latencyTarget}
              className="tw-mx-auto tw-w-[98%]"
              size={displayBag?.summaryPanelSize}
              valueFontClass={displayBag?.summaryPanelValueFontSize}
            />
          )}
        </div>
      </VizItem>
    </VizRow>
  );
};

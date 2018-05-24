import {withModel} from "../../../viz/withModel";
import {ActivityLevelDetailModel} from "./model";
import {
  ActivitySummaryBubbleChart,
  ActivitySummaryTable,
  ActivitySummaryTimelineChart,
  TotalsBarChart
} from "./components";

export const ActivitySummaryBubbleChartViz = withModel(ActivityLevelDetailModel)(ActivitySummaryBubbleChart);
export const ActivitySummaryTableViz = withModel(ActivityLevelDetailModel)(ActivitySummaryTable);
export const ActivitySummaryTimelineChartViz = withModel(ActivityLevelDetailModel)(ActivitySummaryTimelineChart);
export const TotalsBarChartViz = withModel(ActivityLevelDetailModel)(TotalsBarChart);
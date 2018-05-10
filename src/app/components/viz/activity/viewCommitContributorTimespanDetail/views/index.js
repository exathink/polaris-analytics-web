import {ActivitySummaryMaxView} from './activitySummaryMaxView';
import {ActivitySummaryMinView} from './activitySummaryMinView';
import {withMaxMinViews} from "../../../helpers/viewSelectors";

export const ActivitySummaryViz = withMaxMinViews({
  minimized: ActivitySummaryMinView,
  maximized: ActivitySummaryMaxView
});
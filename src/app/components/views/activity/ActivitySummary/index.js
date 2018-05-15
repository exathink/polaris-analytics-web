import {ActivitySummaryView} from './view';
import {withModel} from "../../../../viz/withModel";
import {ActivitySummaryModel} from './model';

export {ActivitySummaryModel};
export const ActivitySummaryViz = withModel(ActivitySummaryModel)(ActivitySummaryView);

export {ActivitySummaryView};

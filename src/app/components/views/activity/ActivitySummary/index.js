import {ActivitySummaryView} from './view';
import {withModel} from "../../../../viz/withModel";
import Model from './model';

export {Model};
export const ActivitySummaryViz = withModel(Model)(ActivitySummaryView);

export {ActivitySummaryView};

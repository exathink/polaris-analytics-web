import {Controller} from './controller';
import {withVizController} from "../../../../viz/withVizController";
import {ActivitySummaryView} from "../../../../components/viz/activity/viewActivitySummary";

export const ActivitySummaryViz =  withVizController(Controller)(ActivitySummaryView);


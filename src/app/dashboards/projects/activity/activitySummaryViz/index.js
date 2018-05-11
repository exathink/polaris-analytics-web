import {Controller} from './controller';
import {withVizController} from "../../../../viz/withVizController";
import {ActivitySummary} from "../../../../components/viz/activity/viewActivitySummary";

export const ActivitySummaryViz =  withVizController(Controller)(ActivitySummary);


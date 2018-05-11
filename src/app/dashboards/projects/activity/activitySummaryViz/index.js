import {Controller} from './controller';
import {withVizController} from "../../../../viz/withVizController";
import {ActivitySummaryView} from "../../../../components/views/activity/ActivitySummary";

export const ActivitySummaryViz =  withVizController(Controller)(ActivitySummaryView);


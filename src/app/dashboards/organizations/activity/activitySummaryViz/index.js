import {withVizController} from "../../../../services/vizData";
import {Controller} from './controller';

import {ActivitySummaryView} from "../../../../components/viz/activity/viewActivitySummary";

export const ActivitySummaryViz = withVizController(Controller)(ActivitySummaryView);

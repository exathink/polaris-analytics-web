import {withVizController} from "../../../../services/vizData";
import {Controller} from './controller';

import {ActivitySummary} from "../../../../components/viz/activity/viewActivitySummary";

export const ActivitySummaryViz = withVizController(Controller)(ActivitySummary);

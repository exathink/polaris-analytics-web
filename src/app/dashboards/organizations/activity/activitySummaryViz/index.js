import {withVizController} from "../../../../services/vizData";
import {Controller} from './controller';

import {ActivitySummaryView} from "../../../../components/views/activity/ActivitySummary";

export const ActivitySummaryViz = withVizController(Controller)(ActivitySummaryView);

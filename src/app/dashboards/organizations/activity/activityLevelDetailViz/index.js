import {withVizController} from "../../../../services/vizData/index";
import ActivitySummaryViz from "../../../../components/viz/activity/viewActivityLevelDetail/index";
import {Controller} from "./controller";

import '../../viz/mocks/serviceMocks'

export const ActivityLevelDetailViz = withVizController(Controller)(ActivitySummaryViz);


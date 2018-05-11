import {withVizController} from "../../../../services/vizData/index";
import {ActivityLevelDetailView} from "../../../../components/views/activity/ActivityLevelDetail/index";
import {Controller} from "./controller";

import '../../viz/mocks/serviceMocks'

export const ActivityLevelDetailViz = withVizController(Controller)(ActivityLevelDetailView);


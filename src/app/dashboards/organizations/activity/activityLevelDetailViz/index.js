import {withVizController} from "../../../../services/vizData/index";
import {ActivityLevelDetailView} from "../../../../components/viz/activity/viewActivityLevelDetail/index";
import {Controller} from "./controller";

import '../../viz/mocks/serviceMocks'

export const ActivityLevelDetailViz = withVizController(Controller)(ActivityLevelDetailView);


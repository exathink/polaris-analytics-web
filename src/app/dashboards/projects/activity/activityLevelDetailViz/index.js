import {withVizController} from "../../../../services/vizData/index";
import {ActivityLevelDetailView} from "../../../../components/views/activity/ActivityLevelDetail/index";
import {Controller} from "./controller";

export const ActivityLevelDetailViz = withVizController(Controller)(ActivityLevelDetailView);




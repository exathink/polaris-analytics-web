import {withVizController} from "../../../../services/vizData/index";
import {ActivityLevelDetailView} from "../../../../components/viz/activity/viewActivityLevelDetail/index";
import {Controller} from "./controller";

export const ActivityLevelDetailViz = withVizController(Controller)(ActivityLevelDetailView);




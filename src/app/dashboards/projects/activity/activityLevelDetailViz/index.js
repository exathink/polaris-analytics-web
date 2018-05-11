import {withVizController} from "../../../../services/vizData/index";
import ActivityLevelDetail from "../../../../components/viz/activity/viewActivityLevelDetail/index";
import {Controller} from "./controller";

export const ActivityLevelDetailViz = withVizController(Controller)(ActivityLevelDetail);




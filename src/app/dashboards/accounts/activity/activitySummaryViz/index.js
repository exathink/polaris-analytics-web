import {withVizController} from "../../../../services/vizData";
import {ActivitySummary} from "../../../../components/viz/activity/viewActivitySummary";
import {Controller} from './controller';

export default withVizController(Controller)(ActivitySummary);

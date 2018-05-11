import {withVizController} from "../../../../services/vizData";
import {ActivitySummaryView} from "../../../../components/viz/activity/viewActivitySummary";
import {Controller} from './controller';

export default withVizController(Controller)(ActivitySummaryView);

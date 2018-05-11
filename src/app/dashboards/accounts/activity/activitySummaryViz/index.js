import {withVizController} from "../../../../services/vizData";
import {ActivitySummaryView} from "../../../../components/views/activity/ActivitySummary";
import {Controller} from './controller';

export default withVizController(Controller)(ActivitySummaryView);

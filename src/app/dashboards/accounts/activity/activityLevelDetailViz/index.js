import {withVizController} from "../../../../services/vizData";

import {ActivityLevelDetailView} from "../../../../components/views/activity/ActivityLevelDetail";
import {Controller} from './controller';

import '../../../organizations/viz/mocks/serviceMocks'


export default withVizController(Controller)(ActivityLevelDetailView);


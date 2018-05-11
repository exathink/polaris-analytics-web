import {withVizController} from "../../../../services/vizData";

import {ActivityLevelDetailView} from "../../../../components/viz/activity/viewActivityLevelDetail";
import {Controller} from './controller';

import '../../../organizations/viz/mocks/serviceMocks'


export default withVizController(Controller)(ActivityLevelDetailView);


import {withVizController} from "../../../../services/vizData";

import ActivityLevelDetail from "../../../../components/viz/activity/viewActivityLevelDetail";
import {Controller} from './controller';

import '../../../organizations/viz/mocks/serviceMocks'


export default withVizController(Controller)(ActivityLevelDetail);


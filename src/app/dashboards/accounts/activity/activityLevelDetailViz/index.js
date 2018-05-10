import {withVizDomainMapper} from "../../../../services/vizData";

import ActivityLevelDetail from "../../../../components/viz/activity/viewActivityLevelDetail";
import Model from './model';

import '../../../organizations/viz/mocks/serviceMocks'


export default withVizDomainMapper(Model)(ActivityLevelDetail);


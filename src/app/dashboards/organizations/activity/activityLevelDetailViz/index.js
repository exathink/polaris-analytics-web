import {withVizDomainMapper} from "../../../../services/vizData/index";
import ActivitySummaryViz from "../../../../components/viz/activity/viewActivityLevelDetail/index";

import '../../viz/mocks/serviceMocks'
import Model from "./model";

export const ActivityLevelDetailViz = withVizDomainMapper(Model)(ActivitySummaryViz);


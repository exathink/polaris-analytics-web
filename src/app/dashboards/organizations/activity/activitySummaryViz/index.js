import {withVizDomainMapper} from "../../../../services/vizData";
import Model from './model';

import {ActivitySummary} from "../../../../components/viz/activity/viewActivitySummary";

export const ActivitySummaryViz = withVizDomainMapper(Model)(ActivitySummary);

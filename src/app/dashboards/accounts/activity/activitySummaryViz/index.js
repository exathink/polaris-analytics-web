import {withVizDomainMapper} from "../../../../services/vizData";
import {ActivitySummary} from "../../../../components/viz/activity/viewActivitySummary";
import Model from './model';

export default withVizDomainMapper(Model)(ActivitySummary);

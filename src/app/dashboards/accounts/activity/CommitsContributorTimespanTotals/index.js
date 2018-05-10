import {withVizDomainMapper} from "../../../../services/vizData";
import {ViewCommitContributorTimespanTotals} from "../../../../components/viz/activity/viewCommitContributorTimespanTotals";
import Model from './model';

export default withVizDomainMapper(Model)(ViewCommitContributorTimespanTotals);

import {dashboard as classic_dashboard} from "./classic_dashboard"
import {dashboard as new_dashboard} from "./new_dashboard"
import {PROJECTS_NEW_DASHBOARD} from "../../../../config/featureFlags";

import {withFeatureFlag} from "../../../components/featureFlags/withFeatureFlag";

export default withFeatureFlag(PROJECTS_NEW_DASHBOARD)({
  whenDisabled: classic_dashboard,
  whenEnabled: new_dashboard
})
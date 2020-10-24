import {default as new_dashboard} from "./new_dashboard";
import {default as flowboard_20} from "./flowboard_20";

import {withFeatureFlag} from "../../../components/featureFlags/withFeatureFlag";
import {PROJECTS_FLOWBOARD_20} from "../../../../config/featureFlags";

export default withFeatureFlag(PROJECTS_FLOWBOARD_20)({
  whenDisabled: new_dashboard,
  whenEnabled: flowboard_20
})

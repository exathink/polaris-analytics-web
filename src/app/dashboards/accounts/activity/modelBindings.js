import {ModelBindings} from "../../../viz/modelBindings";

import {ActivitySummary} from "./modelBindings/activitySummary";
import {ActivityLevelDetail} from "./modelBindings/activityLevelDetail";

export default new ModelBindings(
  'account', [
    ActivitySummary,
    ActivityLevelDetail
  ]
);




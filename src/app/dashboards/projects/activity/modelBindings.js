import {ModelBindings} from "../../../viz/modelBindings";

import {ActivitySummaryModelBinding} from "./modelBindings/activitySummary";
import {ActivityLevelDetailModelBinding} from "./modelBindings/activityLevelDetail";

export default new ModelBindings(
  'account', [
    ActivitySummaryModelBinding,
    ActivityLevelDetailModelBinding
  ]
);




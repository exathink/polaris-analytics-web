import {ModelBindings} from "../../../viz/modelBindings";

import {ActivitySummaryModelBinding} from "./modelBindings/activitySummary";
import {ActivityLevelDetailModelBinding} from "./modelBindings/activityLevelDetail";

import './mocks/activityLevel';

export default new ModelBindings(
  'account', [
    ActivitySummaryModelBinding,
    ActivityLevelDetailModelBinding
  ]
);




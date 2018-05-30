// @flow

import  {Model} from "../../../viz/model";
import {ActiveContext} from "../../../navigation/context";

export type ActivityTotals = {
  commits: number,
  contributors: number,
  earliest_commit: Date,
  latest_commit: Date
}


export class ActivitySummaryModel extends Model<ActivityTotals> {
  context: ActiveContext
}

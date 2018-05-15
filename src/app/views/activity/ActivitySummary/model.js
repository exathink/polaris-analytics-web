// @flow

import  {Model} from "../../../viz/model";

export type ActivityTotals = {
  commits: number,
  contributors: number,
  earliest_commit: Date,
  latest_commit: Date
}


export class ActivitySummaryModel extends Model<ActivityTotals> {};

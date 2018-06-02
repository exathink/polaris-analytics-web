// @flow

import  {Model} from "../../../../framework/viz/model/model";

import {polarisTimestamp} from "../../../../helpers/utility";
import {ActiveContext} from "../../../../framework/navigation/context/activeContext";

export type ActivityTotals = {
  commits: number,
  contributors: number,
  earliest_commit: Date,
  latest_commit: Date
}

type SourceData = {
  commit_count: number,
  contributor_count: number,
  earliest_commit: String,
  latest_commit: String,
}


export class ActivitySummaryModel extends Model<ActivityTotals> {

  context: ActiveContext;

  constructor(data: ActivityTotals, version:number, context:ActiveContext) {
    super(data,version);
    this.context = context;
  }

  static defaultInitModel(source_data: Array<SourceData>, props:{context: ActiveContext}, version: number =0){
    const activity_summary = source_data[0];
    const modelData = {
      commits: activity_summary.commit_count,
      contributors: activity_summary.contributor_count,
      earliest_commit: polarisTimestamp(activity_summary.earliest_commit),
      latest_commit: polarisTimestamp(activity_summary.latest_commit)
    };

     return new ActivitySummaryModel(modelData, version, props.context);
    }
}

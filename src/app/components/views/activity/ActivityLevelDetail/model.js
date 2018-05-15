// @flow
import {Model} from "../../../../viz/model";

export type ActivityLevel = {
  display_name: string,
  color: string,
  isMember: (activitySummary: ActivitySummary) => boolean,
  visible: boolean,
  index: number
}

export type ActivitySummary = {
  id: string;
  entity_name: string,
  commit_count: number,
  contributor_count: number,
  earliest_commit: Date,
  latest_commit: Date,
  span: number,
  days_since_latest_commit: number,
  activity_level: ActivityLevel
}



export default class extends Model<Array<ActivitySummary>> {
  level_label: string;
  level: string;
  subject_label_long: string;
  subject_label: string;
  span_uom: string;
  onDrillDown: () => void;
}




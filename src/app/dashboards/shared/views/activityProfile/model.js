
import {Model} from "../../../../framework/viz/model/model";
import type {Context} from "../../../../framework/navigation/context/context";
import {ActiveContext} from "../../../../framework/navigation/context/activeContext";
import moment from "moment/moment";
import {polarisTimestamp} from "../../../../helpers/utility";
import {withActivityLevel} from "./activityLevel";

export type ActivityLevel = {
  display_name: string,
  color: string,
// eslint-disable-next-line
  isMember: (activitySummary: ActivitySummary) => boolean,
  visible: boolean,
  index: number
}

export type ActivitySummary = {
  id: string;
  entity_name: string,
  commit_count: number,
  secondary_measure: number,
  earliest_commit: Date,
  latest_commit: Date,
  span: number,
  days_since_latest_commit: number,
  activity_level: ActivityLevel
}

type SourceData = {
  detail_instance_id: string,
  detail_instance_name: string,
  commit_count: number,
  contributor_count: number,
  earliest_commit: string,
  latest_commit: string
}

type Props = {context: ActiveContext, childContext: Context, span_uom? : string}

export class ActivityLevelDetailModel extends Model<Array<ActivitySummary>> {
  context: ActiveContext;
  childCount: number;
  secondaryMeasureContext: Context;
  childContext: Context;
  span_uom: string;


  constructor(data: Array<ActivitySummary>, version: number, childCount, secondaryMeasureContext: Context, context: ActiveContext, childContext: Context, span_uom: string) {
    super(data, version);
    this.childCount = childCount;
    this.secondaryMeasureContext = secondaryMeasureContext;
    this.context = context;
    this.childContext = childContext;
    this.span_uom = span_uom;
  }

  onDrillDown(event: {entity_name: string, id: string}) {
    this.context.drillDown(this.childContext, event.entity_name, event.id);
  }

  static initModelFromCommitSummaries(commitSummaries, childCount, secondaryMeasure, secondaryMeasureContext, props) {
    const data = commitSummaries.map(
      commitSummary => {
        const earliest_commit = moment(commitSummary.earliestCommit);
        const latest_commit = moment(commitSummary.latestCommit);
        return withActivityLevel({
          id: commitSummary.key,
          entity_name: commitSummary.name,
          commit_count: commitSummary.commitCount,
          earliest_commit: earliest_commit,
          latest_commit: latest_commit,
          span: moment.duration(latest_commit.diff(earliest_commit)).asYears(),
          days_since_latest_commit: moment().diff(latest_commit, 'days'),
          secondary_measure: commitSummary[secondaryMeasure]
        })
      });
    return new ActivityLevelDetailModel(data, 0,  childCount, secondaryMeasureContext,  props.context, props.childContext, props.span_uom || 'Years');
  }

}







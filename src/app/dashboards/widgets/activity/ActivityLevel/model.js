
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
  contributor_count: number,
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
  childContext: Context;
  span_uom: string;
  onDrillDown: () => void;


  constructor(data: Array<ActivitySummary>, version: number, context: ActiveContext, childContext: Context, span_uom: string) {
    super(data, version);
    this.context = context;
    this.childContext = childContext;
    this.span_uom = span_uom;
  }

  onDrillDown(event: {entity_name: string, id: string}) {
    this.context.drillDown(this.childContext, event.entity_name, event.id);
  }

  static defaultInitModel(source_data: Array<SourceData>, props: Props, version: number =0) {
    const data = source_data.map((source_data_item) => {
        const earliest_commit = polarisTimestamp(source_data_item.earliest_commit);
        const latest_commit = polarisTimestamp(source_data_item.latest_commit);

        return withActivityLevel({
          id: source_data_item.detail_instance_id,
          entity_name: source_data_item.detail_instance_name,
          commit_count: source_data_item.commit_count,
          contributor_count: source_data_item.contributor_count,
          earliest_commit: earliest_commit,
          latest_commit: latest_commit,
          span: moment.duration(latest_commit.diff(earliest_commit)).asYears(),
          days_since_latest_commit: moment().diff(latest_commit, 'days'),
        })
      });
      return new ActivityLevelDetailModel(data, version, props.context, props.childContext, props.span_uom || 'Years');
  }

  static initModelFromCommitSummaries(commitSummaries, props) {
    const data = commitSummaries.map(
      commitSummary => {
        const earliest_commit = moment(commitSummary.earliestCommit);
        const latest_commit = moment(commitSummary.latestCommit);
        return withActivityLevel({
          id: commitSummary.key,
          entity_name: commitSummary.name,
          commit_count: commitSummary.commitCount,
          contributor_count: commitSummary.contributorCount,
          earliest_commit: earliest_commit,
          latest_commit: latest_commit,
          span: moment.duration(latest_commit.diff(earliest_commit)).asYears(),
          days_since_latest_commit: moment().diff(latest_commit, 'days'),
        })
      });
    return new ActivityLevelDetailModel(data, 0, props.context, props.childContext, props.span_uom || 'Years');
  }

}







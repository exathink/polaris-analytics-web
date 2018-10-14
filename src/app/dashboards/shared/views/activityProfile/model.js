import {Model} from "../../../../framework/viz/model/model";
import type {Context} from "../../../../framework/navigation/context/context";
import {ActiveContext} from "../../../../framework/navigation/context/activeContext";
import moment from "moment/moment";
import {withActivityLevel} from "../../helpers/activityLevel";
import {toMoment} from "../../../../helpers/utility";

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


type ActivityLevelSummary = {
  activeCount: number,
  quiescentCount: number,
  dormantCount: number,
  inactiveCount: number
}


export class ActivityLevelDetailModel extends Model<Array<ActivitySummary>> {
  instanceKey: string;
  context: ActiveContext;
  childCount: number;
  activityLevelSummary: ActivityLevelSummary;
  secondaryMeasureContext: Context;
  childContext: Context;
  span_uom: string;
  dimension: string;
  childDimension: string;



  constructor(
    instanceKey: string,
    data: Array<ActivitySummary>,
    version: number,
    childCount,
    activityLevelSummary,
    secondaryMeasureContext: Context,
    dimension: string,
    childDimension: string,
    context: ActiveContext,
    childContext: Context,
    span_uom: string
  ) {
    super(data, version);
    this.instanceKey = instanceKey;
    this.childCount = childCount;
    this.activityLevelSummary = activityLevelSummary;
    this.secondaryMeasureContext = secondaryMeasureContext;
    this.context = context;
    this.childContext = childContext;
    this.span_uom = span_uom;
    this.dimension = dimension;
    this.childDimension = childDimension;
  }


  onDrillDown(event: {entity_name: string, id: string}) {
    this.context.drillDown(this.childContext, event.entity_name, event.id);
  }

  static initModelFromCommitSummaries(
    instanceKey,
    commitSummaries,
    childCount,
    activityLevelSummary,
    secondaryMeasure,
    secondaryMeasureContext,
    dimension,
    childDimension,
    props
  ) {
    const data = commitSummaries.map(
      commitSummary => {
        const earliest_commit = toMoment(commitSummary.earliestCommit);
        const latest_commit = toMoment(commitSummary.latestCommit);
        return withActivityLevel({
          id: commitSummary.key,
          entity_name: commitSummary.name,
          commit_count: commitSummary.commitCount,
          earliest_commit: earliest_commit,
          latest_commit: latest_commit,
          span: moment.duration(latest_commit.diff(earliest_commit)).asYears(),
          days_since_latest_commit: moment().utc().diff(latest_commit, 'days'),
          secondary_measure: secondaryMeasure? commitSummary[secondaryMeasure] : 1
        })
      });
    return new ActivityLevelDetailModel(
      instanceKey,
      data,
      0,
      childCount,
      activityLevelSummary,
      secondaryMeasureContext,
      dimension,
      childDimension,
      props.context,
      props.childContext,
      props.span_uom || 'Years'
    );
  }
}







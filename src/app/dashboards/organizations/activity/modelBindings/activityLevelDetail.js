import {DataSources} from "../dataSources";
import {polarisTimestamp} from "../../../../helpers/utility";
import {withActivityLevel} from "../../../../views/activity/ActivityLevel/activityLevel";
import moment from "moment/moment";

import {ActivityLevelDetailModel} from "../../../../views/activity/ActivityLevel";
import type {ModelFactory} from "../../../../viz/modelFactory";
import {Contexts} from "../../../../meta/contexts";

import {uuidDecode} from "../../../../helpers/uuid";


export const modelFactory: ModelFactory = {
  getDataBinding: props => ([
    {
      dataSource: DataSources.organization_projects_activity_summary,
      params: {
        organization: props.context.getInstanceKey('organization'),
        mock: false
      }
    }
  ]),
  initModel: (source_data, props) => {
    const project_summaries = source_data[0].data;
    const currentContext = props.context;
    return {
      data: project_summaries.map((project_summary) => {
        const earliest_commit = polarisTimestamp(project_summary.earliest_commit);
        const latest_commit = polarisTimestamp(project_summary.latest_commit);

        return withActivityLevel({
          id: project_summary.detail_instance_id,
          entity_name: project_summary.detail_instance_name,
          commit_count: project_summary.commit_count,
          contributor_count: project_summary.contributor_count,
          earliest_commit: earliest_commit,
          latest_commit: latest_commit,
          span: moment.duration(latest_commit.diff(earliest_commit)).asYears(),
          days_since_latest_commit: moment().diff(latest_commit, 'days'),
        })
      }),
      context: currentContext,
      childContext: props.childContext,
      span_uom: 'Years',
      onDrillDown: (event) => {
        console.log(`Drill down to ${event.subject_label} ${event.entity_name} ${event.id}`);
        currentContext.drillDown(props.childContext, event.name, event.id)
      }

    }
  }
};

export const ActivityLevelDetailModelBinding = [ActivityLevelDetailModel, modelFactory];
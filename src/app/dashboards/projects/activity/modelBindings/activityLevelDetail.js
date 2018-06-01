import {DataSources} from "../dataSources";
import {polarisTimestamp} from "../../../../helpers/utility";
import {withActivityLevel} from "../../../../views/activity/ActivityLevel/activityLevel";
import moment from "moment/moment";

import {ActivityLevelDetailModel} from "../../../../views/activity/ActivityLevel";
import {ModelFactory} from "../../../../viz/modelFactory";
import {Contexts} from "../../../../meta/contexts";

export const modelFactory: ModelFactory = {
  getDataBinding: props => ([
    {
      dataSource: DataSources.project_repositories_activity_summary,
      params: {
        project: props.context.getInstanceKey('project'),
        mock: false
      }
    }
  ]),
  initModel: (source_data, props) => {
    const repo_summaries = source_data[0].data;
    return {
      data: repo_summaries.map((project_summary) => {
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
      context: props.context,
      childContext: props.childContext,
      span_uom: 'Years'
    }
  }
};

export const ActivityLevelDetailModelBinding = [ActivityLevelDetailModel, modelFactory];


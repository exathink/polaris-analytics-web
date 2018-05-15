import {DataSources} from "../dataSources";
import {polarisTimestamp} from "../../../../helpers/utility";
import {withActivityLevel} from "../../../../views/activity/ActivityLevelDetail/activityLevel";
import moment from "moment/moment";

import {ActivityLevelDetailModel} from "../../../../views/activity/ActivityLevelDetail";
import {ModelFactory} from "../../../../viz/modelFactory";

export const modelFactory: ModelFactory = {
  getDataBinding: context => ([
    {
      dataSource: DataSources.project_repositories_activity_summary,
      params: {
        organization: context.params().organization,
        project: context.params().project,
        mock: false
      }
    }
  ]),
  initModel: (source_data, props) => {
    const repo_summaries = source_data[0].data;
    const project = props.navigation.current().params().project;
    return {
      data: repo_summaries.map((project_summary) => {
        const earliest_commit = polarisTimestamp(project_summary.earliest_commit);
        const latest_commit = polarisTimestamp(project_summary.latest_commit);

        return withActivityLevel({
          id: project_summary.repository_id,
          entity_name: project_summary.repository,
          commit_count: project_summary.commit_count,
          contributor_count: project_summary.contributor_count,
          earliest_commit: earliest_commit,
          latest_commit: latest_commit,
          span: moment.duration(latest_commit.diff(earliest_commit)).asYears(),
          days_since_latest_commit: moment().diff(latest_commit, 'days'),
        })
      }),
      level_label: 'Project',
      level: project,
      subject_label: 'Repo',
      subject_label_long: 'Repository',
      span_uom: 'Years'
    }
  }
};

export const ActivityLevelDetailModelBinding = [ActivityLevelDetailModel, modelFactory];


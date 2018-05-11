// @flow
import {DataSources} from "../dataSources";
import {polarisTimestamp} from "../../../../helpers/utility";
import {withActivityLevel} from "../../../../components/views/activity/ActivityLevelDetail/activityLevel";
import moment from "moment/moment";

export const Controller = {
  mapStateToProps: (state, ownProps) => ({
    account: state.user.get('account'),
    organization: ownProps.match.params.organization,
    project: ownProps.match.params.project
  }),
  getDataSpec: props => ([
    {
      dataSource: DataSources.project_repositories_activity_summary,
      params: {
        organization: props.organization,
        project: props.project,
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
      level: props.project,
      subject_label: 'Repo',
      subject_label_long: 'Repository',
      subject_label_plural: 'Repositories',
      subject_icon: 'ion-soup-can',
      subject_color: '#6f759c',
      span_uom: 'Years'
    }
  }
};
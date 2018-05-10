import {withVizDomainMapper} from "../../../services/vizData/index";
import {DataSources} from "../dataSources";
import {polarisTimestamp} from "../../../helpers/utility";
import {ActivitySummaryViz} from "../../../components/viz/activity/viewCommitContributorTimespanDetail/index";
import moment from 'moment';
import {withActivityLevel} from "../../../components/viz/activity/viewCommitContributorTimespanDetail/index";




const repositoryActivitySummaryDomainMapper = {
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
    },
    {
      dataSource: DataSources.project_activity_summary,
      params: {
        organization: props.organization,
        project: props.project,
        mock: false
      }
    }
  ]),
  mapDomain: (source_data, props) => {
    const repo_summaries = source_data[0].data;
    const project_summary = source_data[1].data;

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
      summary_data: project_summary.map((org_summary) => ({
        commits: org_summary.commit_count,
        contributors: org_summary.contributor_count,
        earliest_commit: polarisTimestamp(org_summary.earliest_commit),
        latest_commit: polarisTimestamp(org_summary.latest_commit)
      }))[0],
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
export const RepositoryActivitySummaryViz = withVizDomainMapper(repositoryActivitySummaryDomainMapper)(ActivitySummaryViz);


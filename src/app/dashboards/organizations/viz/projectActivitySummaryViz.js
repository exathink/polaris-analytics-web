import {withVizDomainMapper} from "../../../services/vizData/index";
import {DataSources} from "../dataSources";
import {polarisTimestamp} from "../../../helpers/utility";
import {ActivitySummaryViz} from "../../../components/viz/activitySummary/index";
import moment from 'moment';
import {withActivityLevel} from "../../../components/viz/activitySummary/index";

import './mocks/serviceMocks'


const projectActivitySummaryDomainMapper = {
  mapStateToProps: (state, ownProps) => ({
    account: state.user.get('account'),
    organization: ownProps.match.params.organization
  }),
  getDataSpec: props => ([
    {
      dataSource: DataSources.organization_projects_activity_summary,
      params: {
        organization: props.organization,
        mock: false
      }
    },
    {
      dataSource: DataSources.organization_activity_summary,
      params: {
        organization: props.organization,
        mock: false
      }
    }
  ]),
  mapDomain: (source_data, props) => {
    const project_summaries = source_data[0].data;
    const org_summary = source_data[1].data;

    return {
      data: project_summaries.map((project_summary) => {
        const earliest_commit = polarisTimestamp(project_summary.earliest_commit);
        const latest_commit = polarisTimestamp(project_summary.latest_commit);

        return withActivityLevel({
          id: project_summary.project_id,
          entity_name: project_summary.project,
          commit_count: project_summary.commit_count,
          contributor_count: project_summary.contributor_count,
          earliest_commit: earliest_commit,
          latest_commit: latest_commit,
          span: moment.duration(latest_commit.diff(earliest_commit)).asYears(),
          days_since_latest_commit: moment().diff(latest_commit, 'days'),
        })
      }),
      summary_data: org_summary.map((org_summary) => ({
        commits: org_summary.commit_count,
        contributors: org_summary.contributor_count,
        earliest_commit: polarisTimestamp(org_summary.earliest_commit),
        latest_commit: polarisTimestamp(org_summary.latest_commit)
      }))[0],
      level_label: 'Org',
      level: props.organization,
      subject_label: 'Project',
      subject_label_long: 'Project',
      subject_label_plural: 'Projects',
      subject_icon: 'ion-clipboard',
      subject_color: '#42A5F6',
      span_uom: 'Years',
      onDrillDown: (event) => {
        console.log(`Drill down to ${event.subject_label} ${event.entity_name} ${event.id}`);
        props.navigate.push(`/app/dashboard/activity/projects/${props.organization}/${event.entity_name}`)
      }

    }
  }
};
export const ProjectActivitySummaryViz = withVizDomainMapper(projectActivitySummaryDomainMapper)(ActivitySummaryViz);


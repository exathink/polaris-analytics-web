import {DataSources} from "../../dataSources";
import {polarisTimestamp} from "../../../../helpers/utility";
import {withActivityLevel} from "../../../../components/viz/activity/viewActivityLevelDetail/activityLevel";
import moment from "moment/moment";

export default  {
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
    }
  ]),
  mapDomain: (source_data, props) => {
    const project_summaries = source_data[0].data;
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
      level_label: 'Org',
      level: props.organization,
      subject_label: 'Project',
      subject_label_long: 'Project',
      subject_label_plural: 'Projects',
      subject_icon: 'ion-clipboard',
      subject_color: '#356eb2',
      span_uom: 'Years',
      onDrillDown: (event) => {
        console.log(`Drill down to ${event.subject_label} ${event.entity_name} ${event.id}`);
        props.navigate.push(`/app/dashboard/account/organizations/${props.organization}/projects/${event.entity_name}`)
      }

    }
  }
};
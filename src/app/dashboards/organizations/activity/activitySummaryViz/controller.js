import {DataSources} from "../../dataSources";
import {polarisTimestamp} from "../../../../helpers/utility";
import {VizController} from "../../../../viz/vizController";


export const Controller : VizController = {
  mapStateToProps: (state, ownProps) => ({
    account: state.user.get('account'),
    organization: ownProps.match.params.organization
  }),
  getDataSpec: props => ([
    {
      dataSource: DataSources.organization_activity_summary,
      params: {
        organization: props.organization,
        mock: false
      }
    }
  ]),
  mapDomain: (source_data, props) => {
    const org_summary = source_data[0].data;

    return {
      data: org_summary.map((org_summary) => ({
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
      subject_color: '#356eb2',
      span_uom: 'Years'
    }
  }
};



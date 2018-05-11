import {DataSources} from "../dataSources";
import {polarisTimestamp} from "../../../../helpers/utility";

import type {ControllerDelegate} from "../../../../viz/controllerDelegate";

export const Controller: ControllerDelegate = {
  mapStateToProps: (state, ownProps) => ({
    account: state.user.get('account'),
    organization: ownProps.match.params.organization,
    project: ownProps.match.params.project
  }),
  getDataSpec: props => ([
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
    const project_summary = source_data[0].data;

    return {
      data: project_summary.map((org_summary) => ({
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



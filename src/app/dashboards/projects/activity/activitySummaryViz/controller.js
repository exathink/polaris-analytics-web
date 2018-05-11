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
  initModel: (source_data) => {
    const project_summary = source_data[0].data;

    return {
      data: project_summary.map((org_summary) => ({
        commits: org_summary.commit_count,
        contributors: org_summary.contributor_count,
        earliest_commit: polarisTimestamp(org_summary.earliest_commit),
        latest_commit: polarisTimestamp(org_summary.latest_commit)
      }))[0],
      displayProps: {
        bgColor: '#6f759c'
      }
    }
  }
};



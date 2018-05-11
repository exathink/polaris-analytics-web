// @flow
import {DataSources} from "../dataSources";
import {polarisTimestamp} from "../../../../helpers/utility";

import '../../../organizations/viz/mocks/serviceMocks'

import type {ControllerDelegate} from "../../../../viz/controllerDelegate";

export const Controller: ControllerDelegate = {
  mapStateToProps: state => ({
    account: state.user.get('account'),
  }),
  getDataSpec: () => ([
    {
      dataSource: DataSources.account_activity_summary,
      params: {
        mock: false
      }
    }
  ]),
  initModel: (source_data) => {
    const account_summary = source_data[0].data;
    return {
      data: account_summary.map((account_summary) => ({
        commits: account_summary.commit_count,
        contributors: account_summary.contributor_count,
        earliest_commit: polarisTimestamp(account_summary.earliest_commit),
        latest_commit: polarisTimestamp(account_summary.latest_commit)
      }))[0],
      displayProps: {
        bgColor: '#7266BA'
      }
    }
  }
};





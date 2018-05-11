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
  mapDomain: (source_data, props) => {
    const account_summary = source_data[0].data;
    return {
      data: account_summary.map((account_summary) => ({
        commits: account_summary.commit_count,
        contributors: account_summary.contributor_count,
        earliest_commit: polarisTimestamp(account_summary.earliest_commit),
        latest_commit: polarisTimestamp(account_summary.latest_commit)
      }))[0],
      level_label: 'Accounts',
      level: props.account.company,
      subject_label: 'Org',
      subject_label_long: 'Organization',
      subject_label_plural: 'Organizations',
      subject_icon: "ion-ios-albums",
      subject_color: '#7266BA',
      span_uom: 'Years'
    }
  }
};





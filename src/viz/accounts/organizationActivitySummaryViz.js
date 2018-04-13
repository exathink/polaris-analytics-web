import {withDomainMap} from "../withDomainMap";
import {DataSources} from "../dataSources";
import {polarisTimestamp} from "../../helpers/utility";
import {ActivitySummaryViz} from "../../components/viz/activitySummary/index";
import moment from 'moment';
import {withActivityLevel} from "../../components/viz/activitySummary/index";

import '../organizations/mocks/serviceMocks'


const organizationActivitySummaryDomainMapper = {
  mapStateToProps: state => ({
    account: state.user.get('account'),
  }),
  getDataSpec: () => ([{
    dataSource: DataSources.account_organizations_activity_summary,
    params: {
      mock: false
    }
  }]),
  mapDomain: (source_data, props) => {
    const organization_summaries = source_data[0].data;
    return {
      data: organization_summaries.map((organization_summary) => {
        return withActivityLevel({
          id: organization_summary.organization_key,
          entity_name: organization_summary.organization,
          commit_count: organization_summary.commit_count,
          contributor_count: organization_summary.contributor_count,
          earliest_commit: (polarisTimestamp(organization_summary.earliest_commit)),
          latest_commit: (polarisTimestamp(organization_summary.latest_commit)),
          span: (polarisTimestamp(organization_summary.latest_commit).diff(polarisTimestamp(organization_summary.earliest_commit), 'days')),
          days_since_latest_commit: moment().diff(polarisTimestamp(organization_summary.latest_commit), 'days'),
        })
      }),
      level_label: 'Account',
      level: props.account.company,
      subject_label: 'Org',
      subject_label_long: 'Organization',
      span_uom: 'days'
    }
  }
};
export const OrganizationActivitySummaryViz =  withDomainMap(organizationActivitySummaryDomainMapper)(ActivitySummaryViz);


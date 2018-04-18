import {withVizDomainMapper} from "../../../vizData";
import {DataSources} from "../dataSources";
import {polarisTimestamp, span} from "../../../helpers/utility";
import {ActivitySummaryViz} from "../../../components/viz/activitySummary/index";
import moment from 'moment';
import {withActivityLevel} from "../../../components/viz/activitySummary/index";

import '../../organizations/viz/mocks/serviceMocks'


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
        const earliest_commit = polarisTimestamp(organization_summary.earliest_commit);
        const latest_commit = polarisTimestamp(organization_summary.latest_commit);

        return withActivityLevel({
          id: organization_summary.organization_key,
          entity_name: organization_summary.organization,
          commit_count: organization_summary.commit_count,
          contributor_count: organization_summary.contributor_count,
          earliest_commit: earliest_commit,
          latest_commit: latest_commit,
          span: moment.duration(latest_commit.diff(earliest_commit)).asYears(),
          days_since_latest_commit: moment().diff(latest_commit, 'days'),
        })
      }),
      level_label: 'Account',
      level: props.account.company,
      subject_label: 'Org',
      subject_label_long: 'Organization',
      subject_icon: "ion-ios-albums",
      subject_color: '#7266BA',
      span_uom: 'Years',
      onDrillDown: (event) => {
        console.log(`Drill down to ${event.subject_label} ${event.entity_name} ${event.id}`);
        props.navigate.push(`/dashboard/organizations/${event.entity_name}`)
      }
    }
  }
};
export const OrganizationActivitySummaryViz =  withVizDomainMapper(organizationActivitySummaryDomainMapper)(ActivitySummaryViz);


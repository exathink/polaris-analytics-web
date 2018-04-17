import {withDomainMap} from "../withDomainMap";
import {DataSources} from "../dataSources";
import {polarisTimestamp} from "../../helpers/utility";
import {ActivitySummaryViz} from "../../components/viz/activitySummary/index";
import moment from 'moment';
import {withActivityLevel} from "../../components/viz/activitySummary";

import './mocks/serviceMocks'


const projectActivitySummaryDomainMapper = {
  mapStateToProps: (state, ownProps) => ({
    account: state.user.get('account'),
    organization: ownProps.match.params.organization
  }),
  getDataSpec: props => ([{
    dataSource: DataSources.organization_projects_activity_summary,
    params: {
      organization: props.organization,
      mock: false
    }
  }]),
  mapDomain: (source_data, props) => {
    const project_summaries = source_data[0].data;
    return {
      data: project_summaries.map((project_summary) => {
        return withActivityLevel({
          id: project_summary.id,
          entity_name: project_summary.project,
          commit_count: project_summary.commit_count,
          contributor_count: project_summary.contributor_count,
          earliest_commit: (polarisTimestamp(project_summary.earliest_commit)),
          latest_commit: (polarisTimestamp(project_summary.latest_commit)),
          span: (polarisTimestamp(project_summary.latest_commit).diff(polarisTimestamp(project_summary.earliest_commit), 'days')),
          days_since_latest_commit: moment().diff(polarisTimestamp(project_summary.latest_commit), 'days'),
        })
      }),
      level_label: 'Org',
      level: props.organization,
      subject_label: 'Project',
      subject_label_long: 'Project',
      span_uom: 'days'
    }
  }
};
export const ProjectActivitySummaryViz =  withDomainMap(projectActivitySummaryDomainMapper)(ActivitySummaryViz);


import {withDomainMap} from "../../../viz/withDomainMap";
import {DataSources} from "../../../viz/dataSources";
import {ActivitySummary} from "./activitySummary";
import {polarisTimestamp} from "../../../helpers/utility";

export const ProjectActivitySummary =  withDomainMap({
  mapStateToProps: state => ({
    account: state.user.get('account'),
  }),
  getDataSpec: props => ([{
    dataSource: DataSources.project_summary,
    params: {
      organization: props.account.company
    }
  }]),
  mapDomain: (source_data) => {
    const project_summaries = source_data[0].data;
    return {
      entity_names: project_summaries.map((project_summary) => (project_summary.project)),
      commit_counts: project_summaries.map((project_summary) => (project_summary.commit_count)),
      contributor_counts: project_summaries.map((project_summary) => (project_summary.contributor_count)),
      earliest_commits: project_summaries.map((project_summary) => (polarisTimestamp(project_summary.earliest_commit))),
      latest_commits: project_summaries.map((project_summary) => (polarisTimestamp(project_summary.latest_commit))),
      spans: project_summaries.map((project_summary) => (polarisTimestamp(project_summary.latest_commit).diff(polarisTimestamp(project_summary.earliest_commit), 'days'))),
      level: 'Project',
      subject: source_data[0].params.organization,
      span_uom: 'days'
    }

  }
})(ActivitySummary);
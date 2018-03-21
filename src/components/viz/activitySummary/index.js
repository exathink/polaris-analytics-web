import {withDomainMap} from "../../../viz/withDomainMap";
import {DataSources} from "../../../viz/dataSources";
import {polarisTimestamp} from "../../../helpers/utility";
import {ActivitySummaryViz} from "./activitySummaryView";
import './serviceMocks'


const projectActivitySummaryDomainMapper = {
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
      data: project_summaries.map((project_summary) => {
        return {
          entity_name: project_summary.project,
          commit_count: project_summary.commit_count,
          contributor_count: project_summary.contributor_count,
          earliest_commit: (polarisTimestamp(project_summary.earliest_commit)),
          latest_commit: (polarisTimestamp(project_summary.latest_commit)),
          span: (polarisTimestamp(project_summary.latest_commit).diff(polarisTimestamp(project_summary.earliest_commit), 'days'))
        }
      }),
      level: 'Project',
      subject: source_data[0].params.organization,
      span_uom: 'days'
    }
  }
};
export const ProjectActivitySummaryViz =  withDomainMap(projectActivitySummaryDomainMapper)(ActivitySummaryViz);


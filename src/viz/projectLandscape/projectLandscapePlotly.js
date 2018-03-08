// @flow
import React from 'react';
import {Plot} from '../../helpers/plotly';

import {scatterChart} from '../../charts/scatterChart';
import {DataSources} from "../dataSources";

import {withDomainMap} from "../vizDomain";
import {polarisTimestamp} from "../../helpers/utility";

type VizDomain = {
  entity_names: Array<string>,
  commit_counts: Array<number>,
  contributor_counts: Array<number>,
  earliest_commits: Array<Date>,
  latest_commits: Array<Date>,
  spans: Array<number>,
  level: string,
  subject: string,
  span_uom: string

}
type Props = {
  viz_domain: VizDomain,
  containerHeight: number,
  containerWidth: number
}

class ActivitySummary extends React.Component<Props> {

  plotAttributes() {
    if (this.props.viz_domain) {
      const viz_domain: VizDomain = this.props.viz_domain;

      return {
        data: [
          scatterChart({
            'x': viz_domain.spans,
            'y': viz_domain.commit_counts,
            'size': viz_domain.contributor_counts.map(count => count*10),
            'labels': viz_domain.entity_names,
            'text': viz_domain.entity_names,
          })],
        layout: {
          title: `${viz_domain.subject} ${viz_domain.level} Landscape`,
          height: this.props.containerHeight,
          width: this.props.containerWidth,
          autosize: true,
          plotBackground: '#cbdbe8',
        }
      }
    }
  }

  render() {
    return <Plot {...this.plotAttributes()} />
  }
}


const projectLandscapeDomainMapper = {
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
};
export default withDomainMap(projectLandscapeDomainMapper)(ActivitySummary);




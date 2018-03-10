// @flow
import React from 'react';
import {Plot} from '../../../helpers/plotly';

import {scatterChart} from '../../../charts/scatterChart';

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

export class ActivitySummaryPlotly extends React.Component<Props> {

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
          autosize: true,
        },
        style: {
          width: '100%',
          height: '100%',
          background: 'rgba(0,0,0,.6)',
        },
        useResizeHandler: true
      }
    }
  }

  render() {
    return <Plot {...this.plotAttributes()} />
  }
}







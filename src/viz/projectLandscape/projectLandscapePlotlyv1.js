import React from 'react';
import {Plot} from '../../helpers/plotly';

export default class ProjectLandscapePlotly extends React.Component {

  static viz_domains(props){
    return [
      `project-summary/${props.account.company}`
    ];
  }


  render() {
    let viz_domain = ProjectLandscapePlotly.viz_domains(this.props)[0];
    let viz_data = this.props.viz_data.get(viz_domain);
    let labels = viz_data.map((domain) => (`Project: ${domain.project}\nThis is nice`));
    const plotJSON = {
      data: [{
        type: 'scatter',
        x: viz_data.map((domain) => (domain.commit_count)),
        y: viz_data.map((domain) => (domain.contributor_count)),
        text: labels,
        hoverinfo: "text",
        mode: "markers",
        marker: {color: '#ab63fa', size: viz_data.map((domain) => (5*domain.contributor_count))},
        name: 'Bar'
      }],
      layout: {
        plotBackground: '#f3f6fa',
        margin: {t:0, r: 0, l: 20, b: 30},
      }
    };


    return (
      <Plot
        data={plotJSON.data}
        layout={plotJSON.layout}
        config={{displayModeBar: false}}
      />
    )
  }
}


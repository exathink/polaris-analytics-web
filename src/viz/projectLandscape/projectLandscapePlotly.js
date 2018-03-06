class ProjectLandscapePlotly {

  viz_domains (props) {
    return [
      `project-summary/${props.account.company}`
    ];
  }

  plotAttributes(props) {
    let viz_domain = this.viz_domains(props)[0];
    let viz_data = props.viz_data.get(viz_domain);
    if (viz_data) {
      let labels = viz_data.map((domain) => (domain.project));
      return {
        data: [{
          type: 'scatter',
          x: viz_data.map((domain) => (domain.commit_count)),
          y: viz_data.map((domain) => (domain.contributor_count)),
          text: labels,
          textposition: 'bottom',
          hoverinfo: "text",
          mode: "markers+text",
          marker: {color: '#1675fa', size: viz_data.map((domain) => (5 * domain.contributor_count))},
          name: 'Bar'
        }],
        layout: {
          title: `${props.account.company} Project Landscape`,
          height: props.containerHeight,
          width: props.containerWidth,
          autosize: true,
          plotBackground: '#cbdbe8',
        }
      }
    }
  }
}

export default new ProjectLandscapePlotly();



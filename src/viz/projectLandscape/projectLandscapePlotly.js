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
}

export default new ProjectLandscapePlotly();



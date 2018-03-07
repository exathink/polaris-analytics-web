// @flow
import {scatterChart} from '../../charts/scatterChart';
import type {VizDomain} from "../../charts/flow_types";

class ProjectLandscapePlotly {

  viz_domains (props: any) {
    return [
      `project-summary/${props.account.company}`
    ];
  }

  mapDomainToScatterPlot() {
    return {
      'x': (domain: VizDomain) => domain.data().map((project) => (project.commit_count)),
      'y': (domain: VizDomain) => domain.data().map((project) => (project.contributor_count)),
      'size': (domain: VizDomain) => domain.data().map((project) => (5*project.contributor_count)),
      'labels': (domain: VizDomain) => domain.data().map((project) => (project.project)),
      'text': (domain: VizDomain) => domain.data().map((project) => (project.project)),
    }
  }
  plotAttributes(props: any) {
    let viz_domain = this.viz_domains(props)[0];
    let viz_data = props.viz_data.get(viz_domain);
    if (viz_data) {
      const domain_shim = {
        query: () => (`project-summary/${props.account.company}`),
        data: () => (viz_data)
      };

      return {
        data: [scatterChart(domain_shim, this.mapDomainToScatterPlot())],
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



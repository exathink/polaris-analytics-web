import React, { Component } from 'react';
import LayoutContentWrapper from '../components/utility/layoutWrapper';
import LayoutContent from '../components/utility/layoutContent';
import ProjectLandscape from '../viz/projectLandscape/projectLandscape';
import ProjectLandscapePlotly from '../viz/projectLandscape/projectLandscapePlotly';
import PlotViz from '../viz/plotly-viz';
import Viz from '../viz/viz';


export default class extends Component {
  render() {
    return (
      <LayoutContentWrapper style={{ height: '100vh' }}>
        <LayoutContent>
          <Viz component={ProjectLandscape}/>
          <PlotViz component={ProjectLandscapePlotly}/>
        </LayoutContent>
      </LayoutContentWrapper>
    );
  }
}


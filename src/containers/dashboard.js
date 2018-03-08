import React, { Component } from 'react';
import LayoutContentWrapper from '../components/utility/layoutWrapper';
import LayoutContent from '../components/utility/layoutContent';
import ProjectLandscapePlotly from '../viz/projectLandscape/projectLandscapePlotly';

export default class extends Component {
  render() {
    return (
      <LayoutContentWrapper style={{ height: '100vh' }}>
        <LayoutContent>
          <ProjectLandscapePlotly/>
        </LayoutContent>
      </LayoutContentWrapper>
    );
  }
}


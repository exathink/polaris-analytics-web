import React, { Component } from 'react';
import LayoutContentWrapper from '../components/utility/layoutWrapper';
import LayoutContent from '../components/utility/layoutContent';
import ProjectLandscape from '../viz/projectLandscape/projectLandscape';


export default class extends Component {
  render() {
    return (
      <LayoutContentWrapper style={{ height: '100vh' }}>
        <LayoutContent>
          <ProjectLandscape/>
        </LayoutContent>
      </LayoutContentWrapper>
    );
  }
}

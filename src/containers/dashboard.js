import React, { Component } from 'react';
import LayoutContentWrapper from '../components/utility/layoutWrapper';
import LayoutContent from '../components/utility/layoutContent';
import ProjectLandscape from '../viz/projectLandscape/projectLandscape';
import ProjectLandscapePlotly from '../viz/projectLandscape/projectLandscapePlotly';
import PlotViz from '../viz/plotly-viz';
import Viz from '../viz/viz';
import { Card } from 'antd';


import { Flex, Box } from 'reflexbox';

export default class extends Component {
  render() {
    return (
      <LayoutContentWrapper style={{ height: '100vh' }}>
        <LayoutContent>
            <div style={{ height: '50%' }}>
              <Flex style={{ height: '100%' }}>
                <Box w={0.5}>
                  <Card style={{ height: '100%' }}>
                    <PlotViz component={ProjectLandscapePlotly} />
                  </Card>
                </Box>
                <Box w={0.5}>
                    <Viz component={ProjectLandscape}/>
                </Box>
              </Flex>
            </div>
            <div style={{ height: '50%' }}>
              <Flex style={{ height: '100%' }}>
                <Box w={0.5}>
                  <Viz component={ProjectLandscape} />
                </Box>
                <Box w={0.5}>
                  <PlotViz component={ProjectLandscapePlotly}/>
                </Box>
              </Flex>
            </div>
        </LayoutContent>
      </LayoutContentWrapper>
    );
  }
}


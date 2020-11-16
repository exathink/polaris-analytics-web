import React from 'react';

import {VizRow, VizItem} from "../../../shared/containers/layout";
import {ProjectStateTypesChart} from "./projectStateTypesChart";


export const ProjectStateTypesView = ({view}) => (
  <VizRow h={1}>
    <VizItem w={1}>
      <ProjectStateTypesChart
        view={view}
        title={'Project State Types'}
        subTitle={`All Active Items`}
      />
    </VizItem>
  </VizRow>
)
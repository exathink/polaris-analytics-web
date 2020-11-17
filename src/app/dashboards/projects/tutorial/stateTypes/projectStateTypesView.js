import React from 'react';

import {VizRow, VizItem} from "../../../shared/containers/layout";
import {ProjectStateTypesChart} from "./projectStateTypesChart";


export const ProjectStateTypesView = ({workItemStateTypeCounts, view}) => (
  <VizRow h={1}>
    <VizItem w={1}>
      <ProjectStateTypesChart
        workItemStateTypeCounts={workItemStateTypeCounts}
        view={view}
        title={'Project State Types'}
        subTitle={`All Active Items`}
      />
    </VizItem>
  </VizRow>
)
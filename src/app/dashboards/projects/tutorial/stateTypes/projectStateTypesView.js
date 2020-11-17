import React from 'react';
import { VizRow, VizItem } from '../../../shared/containers/layout';
import { ProjectStateTypesChart } from './projectStateTypesChart';

// we can define multiple views here if required or at the widget level
export const ProjectStateTypesView = ({ view }) => {
  function getView() {
    if (view === 'primary') {
      return (
        <ProjectStateTypesChart
          view={view}
          title={'Project State Types'}
          subtitle={'All active items'}
        />
      );
    } else {
      return (
        <ProjectStateTypesChart
          view={view}
          title={'Maximized Project State Types'}
          subtitle={'Maximized All active items'}
        />
      );
    }
  }
  return (
    <VizRow h={1}>
      <VizItem w={1}>{getView()}</VizItem>
    </VizRow>
  );
};

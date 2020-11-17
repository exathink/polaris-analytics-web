import React from 'react';
import { VizRow, VizItem } from '../../../shared/containers/layout';
import { ProjectStateTypesChart } from './projectStateTypesChart';

// we can define multiple views here if required or at the widget level
export const ProjectStateTypesView = ({ workItemStateTypeCounts, view, type }) => {
  return (
    <VizRow h={1}>
      <VizItem w={1}>
        <ProjectStateTypesChart
          workItemStateTypeCounts={workItemStateTypeCounts}
          view={view}
          title={
            view === 'primary'
              ? 'Project State Types'
              : 'Max Project State Types'
          }
          subtitle={
            view === 'primary' ? 'All active items' : 'Max All active items'
          }
          type={type}
        />
      </VizItem>
    </VizRow>
  );
};

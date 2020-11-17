import React from 'react';
import { Loading } from '../../../../components/graphql/loading';
import { ProjectStateTypesView } from './projectStateTypesView';
import { useQueryProjectStateTypes } from './useQueryProjectStateTypes';

export const ProjectStateTypesWidget = ({ instanceKey, days, view }) => {
  const { loading, error, data } = useQueryProjectStateTypes({
    instanceKey,
    closedWithinDays: days,
  });
  if (loading) return <Loading />;
  if (error) return null;

  const { workItemStateTypeCounts } = data['project'];

  return (
    <ProjectStateTypesView
      workItemStateTypeCounts={workItemStateTypeCounts}
      view={view}
    />
  );
};

import React from 'react';
import {Topics} from "../../../meta/topics";


const topic =  {
  ...Topics.contributors,
  routes: [
    {
      match: 'manage-teams',
      component: React.lazy(() => import('./teams/manage/manageTeams'))
    },
    {
      match: 'manage-contributors',
      component: React.lazy(() => import('./manageContributors'))
    },
    {
      match: '',
      component: React.lazy(() => import('./dashboard'))
    }
  ]
};
export default topic;

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
      match: '',
      component: React.lazy(() => import('./dashboard'))
    }
  ]
};
export default topic;

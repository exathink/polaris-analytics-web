import React from 'react';
import {Topics} from "../../meta/topics";


const topic =  {
  ...Topics.account,
  routes: [
    {
      match: 'manage-contributors',
      component: React.lazy(() => import('./contributors/manageContributors'))
    },
    {
      match: '',
      component: React.lazy(() => import('./landing'))
    }
  ]
};
export default topic;

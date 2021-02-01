import React from 'react';
import {Topics} from "../../meta/topics";


const topic =  {
  ...Topics.account,
  routes: [
    {
      match: 'merge-contributors',
      component: React.lazy(() => import('./contributors/mergeContributors'))
    },
    {
      match: '',
      component: React.lazy(() => import('./landing'))
    }
  ]
};
export default topic;

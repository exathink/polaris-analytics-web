import React from 'react';
import {Topics} from "../../meta/topics";


const topic =  {
  ...Topics.account,
  routes: [
    {
      match: 'update-contributor',
      component: React.lazy(() => import('./contributors/updateContributor'))
    },
    {
      match: '',
      component: React.lazy(() => import('./landing'))
    }
  ]
};
export default topic;

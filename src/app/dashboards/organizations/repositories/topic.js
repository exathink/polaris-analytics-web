import React from 'react';
import {Topics} from "../../../meta/topics";


const topic =  {
  ...Topics.repositories,
  routes: [
    {
      match: 'new',
      component: React.lazy(() => import('./manage/addRepository'))
    },
    {
      match: '',
      component: React.lazy(() => import('./dashboard'))
    }
  ]
};
export default topic;

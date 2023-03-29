import React from 'react';
import {Topics} from "../../../meta/topics";


const topic =  {
  ...Topics.pull_requests,
  ContextControl: false,
  routes: [
    {
      match: '',
      component: React.lazy(() => import('./dashboard'))
    }
  ]
};
export default topic;

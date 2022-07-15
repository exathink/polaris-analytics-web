import React from 'react';
import {Topics} from "../../../../meta/topics";


const topic =  {
  ...Topics.second,
  routes: [
    {
      match: '',
      component: React.lazy(() => import('./dashboard'))
    }
  ]
};
export default topic;

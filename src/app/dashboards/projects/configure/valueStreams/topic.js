import React from 'react';
import {Topics} from "../../../../meta/topics";


const topic =  {
  ...Topics.value_streams,
  routes: [
    {
      match: '',
      component: React.lazy(() => import('./dashboard'))
    }
  ]
};
export default topic;

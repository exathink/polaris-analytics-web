import React from 'react';
import {Topics} from "../../../../meta/topics";

const topic = {
  ...Topics.valueStreamMap,
  routes: [
    {
      match: '',
      component: React.lazy(() => import('./dashboard'))
    }
  ]
};

export default topic;



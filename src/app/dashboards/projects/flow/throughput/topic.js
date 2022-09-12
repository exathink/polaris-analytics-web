import React from 'react';
import {Topics} from "../../../../meta/topics";

const topic = {
  ...Topics.throughput,
  routes: [
    {
      match: '',
      component: React.lazy(() => import('./dashboard'))
    }
  ]
};

export default topic;

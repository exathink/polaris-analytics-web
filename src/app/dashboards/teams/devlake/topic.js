import React from 'react';
import {Topics} from "../../../meta/topics";

const topic = {
  ...Topics.devlake,
  routes: [
    {
      match: '',
      component: React.lazy(() => import('./dashboard'))
    }
  ]
};

export default topic;



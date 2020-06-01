import React from 'react';
import {Topics} from "../../../meta/topics";

const topic = {
  ...Topics.work_item,
  routes: [
    {
      match: '',
      component: React.lazy(() => import('./dashboard'))
    }
  ]
};

export default topic;



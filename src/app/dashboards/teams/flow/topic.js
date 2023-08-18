import React from 'react';
import {Topics} from "../../../meta/topics";

const topic = {
  ...Topics.flow,
  routes: [
    {
      match: '',
      component: React.lazy(() => import('./wip_dashboard'))
    }
  ]
};

export default topic;



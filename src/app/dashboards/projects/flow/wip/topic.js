import React from 'react';
import {Topics} from "../../../../meta/topics";

const topic = {
  ...Topics.motion,
  routes: [
    {
      match: '',
      component: React.lazy(() => import('../../wip/dashboard'))
    }
  ]
};

export default topic;



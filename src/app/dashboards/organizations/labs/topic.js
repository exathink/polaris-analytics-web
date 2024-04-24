import React from 'react';
import {Topics} from "../../../meta/index";

const topic = {
  ...Topics.labs,
  routes: [
    {
      match: '',
      component: React.lazy(() => import('../network/cytoscape'))
    }
  ]
};

export default topic;
import React from 'react';
import {Topics} from "../../../meta/index";

const topic = {
  ...Topics.network,
  routes: [
    {
      match: '',
      component: React.lazy(() => import('./cytoscape'))
    }
  ]
};

export default topic;
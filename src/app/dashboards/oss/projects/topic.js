import React from 'react';
import {Topics} from "../../../meta/index";

const topic = {
  ...Topics.projects,
  routes: [
    {
      match: '',
      component: React.lazy(() => import('./browsePublicProjects'))
    }
  ]
};

export default topic;
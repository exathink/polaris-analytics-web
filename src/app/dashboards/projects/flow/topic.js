import React from 'react';
import {Topics} from "../../../meta/topics";

const topic = {
  ...Topics.flow,
  routes: [
    {
      match: "newflow",
      component: React.lazy(() => import('../newFlow/dashboard')),
      subnav: true,
      ...Topics.newflow,
    },
    {
      match: "second",
      component: React.lazy(() => import('./second/dashboard')),
      subnav: true,
      ...Topics.second,
    },
    {
      match: '',
      component: React.lazy(() => import('./dashboard'))
    }
  ]
};

export default topic;



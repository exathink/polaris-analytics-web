import React from 'react';
import {Topics} from "../../../meta/topics";

const topic = {
  ...Topics.flow,
  routes: [
    {
      match: "first",
      component: React.lazy(() => import('../first/dashboard')),
      ...Topics.first,
      subnav: true,
    },
    {
      match: "second",
      component: React.lazy(() => import('../second/dashboard')),
      ...Topics.second,
      subnav: true,
    },
    {
      match: '',
      component: React.lazy(() => import('./dashboard'))
    }
  ]
};

export default topic;



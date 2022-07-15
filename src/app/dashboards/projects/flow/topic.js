import React from 'react';
import {Topics} from "../../../meta/topics";

const topic = {
  ...Topics.flow,
  routes: [
    {
      match: "first",
      component: React.lazy(() => import('../first/dashboard')),
      subnav: true,
      ...Topics.first,
    },
    {
      match: "second",
      component: React.lazy(() => import('../second/dashboard')),
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



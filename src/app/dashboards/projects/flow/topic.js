import React from 'react';
import {Topics} from "../../../meta/topics";
import Summary from "./summary/topic";
import Second from "./second/topic";

const topic = {
  ...Topics.flow,
  routes: [
    {
      requiredFeatures: ['ui.new-card-design'],
      match: "summary",
      subnav: true,
      topic: Summary,
    },
    {
      requiredFeatures: ['ui.new-card-design'],
      match: "second",
      subnav: true,
      topic: Second,
    },
    {
      requiredFeatures: ['ui.new-card-design'],
      match: '',
      redirect: 'summary'
    },
    // This technique works because when the feature flag is present the redirect route to topic overides the route to
    // the main dashboard. Its a bit of a hack, but works for now without having to have a switch in the routes array.
    {
      match: '',
      component: React.lazy(() => import('./dashboard'))
    }
  ]
};

export default topic;



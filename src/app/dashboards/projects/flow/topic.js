import React from "react";
import { Topics } from "../../../meta/topics";
import Summary from "./summary/topic";
import Wip from "./wip/topic";
import ResponseTime from "./responseTime/topic";
import Throughput from "./throughput/topic";
import PullRequests from "./pull_requests/topic";
import ValueMix from "./valueMix/topic";

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
      match: "wip",
      subnav: true,
      topic: Wip,
    },
    {
      requiredFeatures: ['ui.new-card-design'],
      match: "responseTime",
      subnav: true,
      topic: ResponseTime,
    },
   {
      requiredFeatures: ['ui.new-card-design'],
      match: "throughput",
      subnav: true,
      topic: Throughput,
    },
    {
      requiredFeatures: ['ui.new-card-design'],
      match: "valueMix",
      subnav: true,
      topic: ValueMix,
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



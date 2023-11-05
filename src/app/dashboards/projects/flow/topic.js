import React from "react";
import { Topics } from "../../../meta/topics";
import Stability from "./stability/topic";
import Wip from "./wip/topic";
import ResponseTime from "./responseTime/topic";
import Throughput from "./throughput/topic";
import PullRequests from "./pull_requests/topic";
import ValueMix from "./valueMix/topic";
import TimeboxSettings from "./timeBoxSettings/topic";

const topic = {
  ...Topics.flow,
  routes: [
    {
      requiredFeatures: ['ui.new-card-design'],
      match: "stability",
      subnav: true,
      topic: Stability,
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
      subnav: true,
      match: 'timebox-settings',
      topic: TimeboxSettings
    },
    {
      requiredFeatures: ['ui.new-card-design'],
      match: '',
      redirect: 'stability'
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



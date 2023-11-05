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
      match: "stability",
      subnav: true,
      topic: Stability,
    },
    {

      match: "wip",
      subnav: true,
      topic: Wip,
    },
    {

      match: "responseTime",
      subnav: true,
      topic: ResponseTime,
    },
   {

      match: "throughput",
      subnav: true,
      topic: Throughput,
    },
    {

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
      match: '',
      redirect: 'stability'
    },
  ]
};

export default topic;



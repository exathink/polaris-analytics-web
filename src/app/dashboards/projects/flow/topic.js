import React from "react";
import { Topics } from "../../../meta/topics";
import Stability from "./stability/topic";
import Wip from "./wip/topic";
import ResponseTime from "./responseTime/topic";
import Throughput from "./throughput/topic";
import PullRequests from "./pull_requests/topic";
import ValueMix from "./valueMix/topic";
import Trends from "./trends/topic";
import Simulate from "../configure/valueStreamMap/topic";

const topic = {
  ...Topics.flow,
  routes: [
    {
      match: "trends",
      subnav: true,
      topic: Trends,
    },
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

      match: "code-reviews",
      subnav: true,
      topic: PullRequests,
    },
    {

      match: "simulate",
      subnav: true,
      topic: Simulate,
    },
    {
      match: '',
      redirect: 'trends'
    },
  ]
};

export default topic;



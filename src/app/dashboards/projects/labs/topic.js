import React from 'react';
import {Topics} from "../../../meta";
import  Network from "./network/topic";
import Charts from "./charts/topic";

const topic = {
  ...Topics.labs,
  routes: [
    {
      match: 'network',
      subnav: true,
      topic: Network,
    },
    {
      match: 'charts',
      subnav: true,
      topic: Charts,
    },
    {
      match: '',
      redirect: 'network',
    }
  ]
};

export default topic;
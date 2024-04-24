import React from 'react';
import {Topics} from "../../../meta/index";
import  Network from "./network/topic"
const topic = {
  ...Topics.labs,
  routes: [
    {
      match: 'network',
      subnav: true,
      topic: Network,
    },
    {
      match: '',
      redirect: 'network',
    }
  ]
};

export default topic;
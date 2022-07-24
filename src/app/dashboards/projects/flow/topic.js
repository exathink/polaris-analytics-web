import React from 'react';
import {Topics} from "../../../meta/topics";
import First from "./first/topic";
import Second from "./second/topic";

const topic = {
  ...Topics.flow,
  routes: [
    {
      match: "first",
      subnav: true,
      topic: First,
      ...First,
    },
    {
      match: "second",
      subnav: true,
      topic: Second,
      ...Second,
    },
    {
      match: '',
      redirect: 'second'
    }
  ]
};

export default topic;



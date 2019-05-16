import React from "react";
import {Contexts, Topics} from "../meta";

import Landing from './landing';

const topic = {
  ...Topics.dashboard,
  routes: [
    {
      match: '',
      component: Landing
    }
  ]
}

export default topic;

import React from "react";
import {Topics} from "../../meta";
import asyncComponent from "../../../helpers/AsyncFunc";


const topic = {
  ...Topics.system,
  routes: [
    {
      match: '',
      component: asyncComponent(() => import('./landing'))
    }
  ]
}

export default topic;

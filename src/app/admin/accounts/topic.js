import React from "react";
import {Contexts, Topics} from "../../meta";
import {NavCard} from "../../components/cards";
import Landing from './landing';

const topic = {
  ...Topics.accounts,
  routes: [
    {
      match: '',
      component: Landing
    }
  ]
}

export default topic;

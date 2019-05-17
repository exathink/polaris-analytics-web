import React from "react";
import {Contexts, Topics} from "../../../meta";
import {NavCard} from "../../../components/cards";
import asyncComponent from "../../../../helpers/AsyncFunc";


const topic = {
  ...Topics.manage,
  routes: [
    {
      match: 'foo',
      component: () => 'bar'

    },
    {
      match: '',
      component: asyncComponent(() => import('./manageAccounts'))
    }
  ]
}

export default topic;

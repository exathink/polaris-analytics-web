import type {Context} from "../../framework/navigation/context/context";
import asyncComponent from "../../../helpers/AsyncFunc";
import {Topics} from "../../meta";

const topic = {
  ...Topics.publicProjects,
  routes: [
    {
      match: '',
      component: asyncComponent(() => import('./browsePublicProjects'))
    }
  ]
};

export default topic;
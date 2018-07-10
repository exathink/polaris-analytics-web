import asyncComponent from "../../../helpers/AsyncFunc";
import {Topics} from "../../meta";

const topic = {
  ...Topics.projects,
  routes: [
    {
      match: '',
      component: asyncComponent(() => import('./browsePublicProjects'))
    }
  ]
};

export default topic;
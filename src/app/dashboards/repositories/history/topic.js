import asyncComponent from "../../../../helpers/AsyncFunc";
import {Topics} from "../../../meta/topics";

const topic = {
  ...Topics.history,
  routes: [
    {
      match: '',
      component: asyncComponent(() => import('./dashboard'))
    }
  ]
};

export default topic;



import {Topics} from "../../../meta/topics";
import asyncComponent from "../../../../helpers/AsyncFunc";

const topic =  {
  ...Topics.work,
  optional: true,
  routes: [
    {
      match: '',
      component: asyncComponent(() => import('./dashboard'))
    }
  ]
};
export default topic;

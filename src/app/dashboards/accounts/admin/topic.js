import asyncComponent from "../../../../helpers/AsyncFunc";
import {Topics} from "../../../meta/topics";


const topic =  {
  ...Topics.admin,
  routes: [
    {
      match: '',
      component: asyncComponent(() => import('./dashboard'))
    }
  ]
};
export default topic;

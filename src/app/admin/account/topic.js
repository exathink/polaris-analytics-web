import asyncComponent from "../../../helpers/AsyncFunc";
import {Topics} from "../../meta/topics";


const topic =  {
  ...Topics.account,
  routes: [
    {
      match: '',
      component: asyncComponent(() => import('./landing'))
    }
  ]
};
export default topic;

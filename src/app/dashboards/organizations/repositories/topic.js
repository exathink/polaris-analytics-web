import {Topics} from "../../../meta/topics";
import asyncComponent from "../../../../helpers/AsyncFunc";

const topic =  {
  ...Topics.repositories,
  routes: [
    {
      match: 'new',
      component: asyncComponent(() => import('./manage/addRepository'))
    },
    {
      match: '',
      component: asyncComponent(() => import('./dashboard'))
    }
  ]
};
export default topic;

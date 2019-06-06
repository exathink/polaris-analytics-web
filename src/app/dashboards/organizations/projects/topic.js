import {Topics} from "../../../meta/topics";
import asyncComponent from "../../../../helpers/AsyncFunc";

const topic =  {
  ...Topics.projects,
  routes: [
    {
      match: 'new',
      component: asyncComponent(() => import('./manage/addProject'))
    },
    {
      match: '',
      component: asyncComponent(() => import('./dashboard'))
    }
  ]
};
export default topic;

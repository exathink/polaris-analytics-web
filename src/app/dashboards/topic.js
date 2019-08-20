import {Topics} from "../meta";

import Landing from './landing';

const topic = {
  ...Topics.dashboard,
  routes: [
    {
      match: '',
      component: Landing
    }
  ]
}

export default topic;

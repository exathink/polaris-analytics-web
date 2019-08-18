import React from "react";
import {Topics} from "../../meta";



const topic = {
  ...Topics.user,
  routes: [
    {
      match: '',
      component: React.lazy(() => import('./landing'))
    }
  ]
}

export default topic;

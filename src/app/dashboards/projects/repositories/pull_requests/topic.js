import React from "react";
import { Topics } from "../../../../meta/topics";

const topic =  {
  ...Topics.pull_requests,
  routes: [

    {
      match: '',
      component: React.lazy(() => import('../../pull_requests/dashboard'))
    }
  ]
};
export default topic;

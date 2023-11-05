import React from "react";
import { Topics } from "../../../meta/topics";
import Repositories from "./summary/topic";
import Activity from "./activity/topic";
import PullRequests from "./pull_requests/topic";
import Traceability from "./traceability/topic";

import { UI_NEW_CARD_DESIGN } from "../../../../config/featureFlags";


const topic =  {
  ...Topics.repositories,
  ContextControl: false,
  routes: [
    {
      match: 'activity',
      subnav: true,
      topic: Activity,
    },
    {

      match: 'repositories',
      subnav: true,
      topic: Repositories,
    },
    {
      match: '',
      redirect: 'activity'
    }
  ]
};
export default topic;

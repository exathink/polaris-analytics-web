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
      requiredFeatures: [UI_NEW_CARD_DESIGN],
      match: 'summary',
      subnav: true,
      topic: Repositories,
    },
    {
      requiredFeatures: [UI_NEW_CARD_DESIGN],
      match: 'activity',
      subnav: true,
      topic: Activity,
    },
    {
      requiredFeatures: [UI_NEW_CARD_DESIGN],
      match: 'shadow-work',
      subnav: true,
      topic: Traceability,
    },
    {
      requiredFeatures: [UI_NEW_CARD_DESIGN],
      match: 'pull-requests',
      subnav: true,
      topic: PullRequests,
    },
    {
      requiredFeatures: [UI_NEW_CARD_DESIGN],
      match: '',
      redirect: 'summary'
    },
    {
      match: '',
      component: React.lazy(() => import('./dashboard'))
    }
  ]
};
export default topic;

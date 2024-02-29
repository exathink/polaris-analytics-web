import React from 'react';
import {Topics} from "../../../meta/topics";
import {NETWORK_VIZ} from "../../../../config/featureFlags";


const topic =  {
  ...Topics.projects,
  routes: [
    {
      match: 'new',
      component: React.lazy(() => import('./manage/addProject'))
    },
    {
      requiredFeatures: [NETWORK_VIZ],
      match: '',
      component: React.lazy(() => import('./network_dashboard'))
    },
    {
      match: '',
      component: React.lazy(() => import('./dashboard'))
    }
  ]
};
export default topic;

import React from 'react';
import {Topics} from "../../../meta/index";

const topic = {
  ...Topics.organizations,
  routes: [
    {
      match: '',
      component: React.lazy(() => import('./browsePublicOrganizations'))
    }
  ]
};

export default topic;
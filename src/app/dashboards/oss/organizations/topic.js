import asyncComponent from "../../../../helpers/AsyncFunc";
import {Topics} from "../../../meta/index";

const topic = {
  ...Topics.organizations,
  routes: [
    {
      match: '',
      component: asyncComponent(() => import('./browsePublicOrganizations'))
    }
  ]
};

export default topic;
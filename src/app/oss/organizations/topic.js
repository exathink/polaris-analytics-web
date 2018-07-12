import asyncComponent from "../../../helpers/AsyncFunc";
import {Topics} from "../../meta";

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
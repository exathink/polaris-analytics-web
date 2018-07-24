import type {Context} from "./framework/navigation/context/context";
import Dashboard from "./dashboards/context";
import OpenSource from "./oss/context";
import asyncComponent from "../helpers/AsyncFunc";

const context: Context = {
  name: 'app',
  hidden: true,
  routes: [
    {
      match: 'dashboard',
      context: Dashboard,
    },
    {
      match: 'oss',
      context: OpenSource,
    },
    {
      match: '',
      component: asyncComponent(() => import('./pages/landing'))
    }
  ]
};

export default context;

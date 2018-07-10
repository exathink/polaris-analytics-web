import type {Context} from "./framework/navigation/context/context";
import Dashboard from "./dashboards/context";
import OpenSource from "./oss/context";

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
      redirect: 'dashboard'
    }
  ]
};

export default context;

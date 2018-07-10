import type {Context} from "./framework/navigation/context/context";
import Dashboard from "./dashboards/context";
import Browse from "./browse/context";

const context: Context = {
  name: 'app',
  hidden: true,
  routes: [
    {
      match: 'dashboard',
      context: Dashboard,
    },
    {
      match: 'browse',
      context: Browse,
    },
    {
      match: '',
      redirect: 'dashboard'
    }
  ]
};

export default context;

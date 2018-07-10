import type {Context} from "./framework/navigation/context/context";
import Dashboard from "./dashboards/context";

const context: Context = {
  name: 'app',
  hidden: true,
  routes: [
    {
      match: 'dashboard',
      context: Dashboard,
    },
    {
      match: '',
      redirect: 'dashboard'
    }
  ]
};

export default context;

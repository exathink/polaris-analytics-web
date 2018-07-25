import Organizations from "./organizations/context";
import type {Context} from "../framework/navigation/context/context";
import Projects from "./projects/context";
import Accounts from "./accounts/context";
import Repositories from "./repositories/context";

const context: Context = {
  name: 'dashboard',
  hidden: true,
  routes: [
    {
      match: 'organizations',
      context: Organizations,
    },
    {
      match: 'projects',
      context: Projects,
    },
    {
      match: 'repositories',
      context: Repositories,
    },
    {
      match: 'account',
      context: Accounts,
    },
    {
      match: '',
      redirect: 'account'
    }
  ]
};

export default context;
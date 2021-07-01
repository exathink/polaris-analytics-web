import Organizations from "./organizations/context";
import type {Context} from "../framework/navigation/context/context";
import Projects from "./projects/context";
import Teams from "./teams/context";
import Accounts from "./accounts/context";
import Repositories from "./repositories/context";
import Contributors from "./contributors/context";
import Commits from "./commits/context";
import WorkItems from "./work_items/context";
import OpenSource from "./oss/context";



const context: Context = {
  name: 'dashboard',
  hidden: true,
  routes: [
    {
      match: 'organizations',
      context: Organizations,
    },
    {
      match: 'value-streams',
      context: Projects,
    },
    {
      match: 'teams',
      context: Teams,
    },
    {
      match: 'repositories',
      context: Repositories,
    },
    {
      match: 'contributors',
      context: Contributors,
    },
    {
      match: 'account',
      context: Accounts,
    },
    {
      match: 'commits',
      context: Commits,
    },
    {
      match: 'work_items',
      context: WorkItems,
    },
    {
      match: 'oss',
      context: OpenSource,
    },
    {
      match: '',
      redirect: 'account'
    }
  ]
};

export default context;
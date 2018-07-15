import type {Context} from "../framework/navigation/context/context";
import PublicProjects from "./projects/topic";
import PublicOrganizations from "./organizations/topic";

import {Contexts} from "../meta";

const context: Context = {
  ...Contexts.oss,
  routes: [
    {
      match: 'projects',
      topic: PublicProjects
    },
    {
      match: 'organizations',
      topic: PublicOrganizations
    },
    {
      match: '',
      redirect: 'projects'
    }
  ]
};
export default context;
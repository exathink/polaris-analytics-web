import type {Context} from "../../framework/navigation/context/context";
import PublicProjects from "./projects/topic";
import PublicOrganizations from "./organizations/topic";

import {Contexts} from "../../meta/index";

const context: Context = {
  ...Contexts.oss,
  routes: [
    {
      match: 'organizations',
      topic: PublicOrganizations
    },
    {
      match: 'projects',
      topic: PublicProjects
    },
    {
      match: '',
      redirect: 'organizations'
    }
  ]
};
export default context;
import type {Context} from "../framework/navigation/context/context";
import PublicProjects from "./projects/topic";
import {Contexts} from "../meta";

const context: Context = {
  ...Contexts.browse,
  routes: [
    {
      match: 'projects',
      topic: PublicProjects
    },
    {
      match: '',
      redirect: 'projects'
    }
  ]
};
export default context;
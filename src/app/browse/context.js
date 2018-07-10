import type {Context} from "../framework/navigation/context/context";
import PublicProjects from "./publicProjects/topic";
import {Contexts} from "../meta";

const context: Context = {
  ...Contexts.browse,
  routes: [
    {
      match: 'public-projects',
      topic: PublicProjects
    }
  ]
};
export default context;
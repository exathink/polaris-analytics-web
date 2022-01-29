
import Videos from "./topic";

import {Contexts} from "../../meta/index";

const context = {
  ...Contexts.library,
  routes: [
    {
      match: 'videos',
      topic: Videos
    },
    {
      match: '',
      redirect: 'videos'
    }
  ]
};
export default context;
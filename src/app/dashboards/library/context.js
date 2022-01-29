
import Videos from "./topic";

import {Contexts} from "../../meta/index";

const context = {
  ...Contexts.videos,
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
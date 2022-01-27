
import Videos from "./topic";

import {Contexts} from "../../meta/index";

const context = {
  ...Contexts.videos,
  routes: [
    {
      match: 'gallery',
      topic: Videos
    },
    {
      match: '',
      redirect: 'gallery'
    }
  ]
};
export default context;
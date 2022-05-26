
import Insights from "./topic";

import {Contexts} from "../../meta/index";

const context = {
  ...Contexts.insights,
  routes: [
    {
      match: 'insights',
      topic: Insights
    },
    {
      match: '',
      redirect: 'insights'
    }
  ]
};
export default context;
import {Topics} from "../../../meta/topics";
import ConfigureDashboard from "./dashboard";

const topic =  {
  ...Topics.flowModel,
  routes: [
    {
      match: '',
      component: ConfigureDashboard
    }
  ]
};
export default topic;
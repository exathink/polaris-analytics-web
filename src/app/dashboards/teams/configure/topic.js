import {Topics} from "../../../meta/topics";
import ConfigureDashboard from "./dashboard";

const topic =  {
  ...Topics.configure,
  routes: [
    {
      match: '',
      component: ConfigureDashboard
    }
  ]
};
export default topic;
import {Topics} from "../../../meta/topics";
import ConfigureDashboard from "../../teams/configure/dashboard";

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
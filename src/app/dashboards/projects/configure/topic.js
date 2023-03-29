import React from 'react';
import {Topics} from "../../../meta/topics";
import {ResponseTimeSLASettingsDashboard} from "../../shared/widgets/configure/settingWidgets";
import ConfigureDashboard, {ValueStreamMappingDashboard} from "./dashboard";

const topic =  {
  ...Topics.configure,
  ContextControl: false,
  routes: [
    {
      match: 'value-stream',
      component: () => <ValueStreamMappingDashboard/>
    },
    {
      match: 'response-time-sla',
      component: () => <ResponseTimeSLASettingsDashboard/>
    },
    {
      match: '',
      component: ConfigureDashboard
    }
  ]
};
export default topic;
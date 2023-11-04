import React from 'react';
import {Topics} from "../../../meta/topics";
import {ResponseTimeSLASettingsDashboard} from "../../shared/widgets/configure/settingWidgets";
import ConfigureDashboard, {ValueStreamMappingDashboard} from "./dashboard";
import ValueStreamMapping from "./valueStreamMapping/topic"

const topic =  {
  ...Topics.configure,
  ContextControl: false,
  routes: [
    {
      subnav: true,
      match: 'value-stream-mapping',
      topic: ValueStreamMapping
    },
    {
      match: 'response-time-sla',
      component: () => <ResponseTimeSLASettingsDashboard/>
    },
    {
      match: '',
      redirect: "value-stream-mapping"
    }
  ]
};
export default topic;
import React from 'react';
import {Topics} from "../../../meta/topics";
import {ResponseTimeSLASettingsDashboard} from "../../shared/widgets/configure/settingWidgets";
import ConfigureDashboard from "./dashboard";
import ValueStreamMapping from "./valueStreamMapping/topic";
import ValueStreams from "../valueStreams/topic";
import StabilityGoals from "./stabilityGoals/topic";
import GeneralSettings from "./generalSettings/topic";
import { ValueStreamMappingDashboard } from "./valueStreamMapping/dashboard";
import ValueStreamMap from "./valueStreamMap/topic";

const topic =  {
  ...Topics.flowModel,
  ContextControl: false,
  routes: [
    {

      match: "Value Stream Map",
      subnav: true,
      topic: ValueStreamMap,
    },
    {
      subnav: true,
      match: 'value-stream-mapping',
      topic: ValueStreamMapping
    },
    {
      subnav: true,
      match: 'stability-goals',
      topic: StabilityGoals
    },
    {
      subnav: true,
      match: 'general-settings',
      topic: GeneralSettings
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
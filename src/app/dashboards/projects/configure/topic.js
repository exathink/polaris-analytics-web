import React from 'react';
import {Topics} from "../../../meta/topics";
import {ResponseTimeSLASettingsDashboard} from "../../shared/widgets/configure/settingWidgets";
import ConfigureDashboard from "./dashboard";
import ValueStreamMapping from "./valueStreamMapping/topic";
import ValueStreams from "./valueStreams/topic";
import TimeboxSettings from "./timeBoxSettings/topic";
import GeneralSettings from "./generalSettings/topic";
import { ValueStreamMappingDashboard } from "./valueStreamMapping/dashboard";

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
      subnav: true,
      match: 'value-streams',
      topic: ValueStreams
    },
    {
      subnav: true,
      match: 'stability-settings',
      topic: TimeboxSettings
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
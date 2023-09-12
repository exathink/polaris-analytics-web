import React from 'react';
import {FormattedMessage} from 'react-intl.macro';

import FourZeroFour from "../../../containers/Page/404";
import type {Context} from '../../framework/navigation/context/context';

import Wip from './wip/topic';
import Code from './code/topic';
import {Contexts} from "../../meta/contexts";
import {instanceMatchPattern} from "../../framework/navigation/context/helpers";
import ResponseTime from "./responseTime/topic";
import Throughput from "./throughput/topic";
import Configure from "./configure/topic";
import Alignment from "./alignment/topic";

const messages = {
  instanceDisplay: (instanceName) => (
    <FormattedMessage
      id="contexts.teams.instance"
      defaultMessage="Team: {instance}"
      values={{instance: instanceName}}/>
  )
};

const context : Context = {
  ...Contexts.teams,
  hidden: true,
  routes: [
    {
      match: `${instanceMatchPattern('team')}`,
      context: {
        ...Contexts.teams,
        display: match => messages.instanceDisplay(match.params.team),
        routes: [
          {
            match: 'wip',
            topic: Wip
          },
          {
            match: 'code',
            topic: Code
          },
          {

            match: 'response-time',
            topic: ResponseTime
          },
          {

            match: 'throughput',
            topic: Throughput
          },
          {

            match: 'alignment',
            topic: Alignment
          },
          {
            match: "configure",
            topic: Configure
          },
          {
            match: '',
            redirect: 'wip'
          }
        ]
      }
    },
    {
      match: '',
      component: FourZeroFour
    }
  ]
};

export default context;


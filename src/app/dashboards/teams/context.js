import React from 'react';
import {FormattedMessage} from 'react-intl.macro';

import FourZeroFour from "../../../containers/Page/404";
import type {Context} from '../../framework/navigation/context/context';

import Flow from './flow/topic';
import Code from './code/topic';
import {Contexts} from "../../meta/contexts";
import {instanceMatchPattern} from "../../framework/navigation/context/helpers";
import ResponseTime from "./responseTime/topic";
import Throughput from "./throughput/topic";
import Configure from "./configure/topic";

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
            match: 'flow',
            topic: Flow
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
            match: "configure",
            topic: Configure
          },
          {
            match: '',
            redirect: 'code'
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


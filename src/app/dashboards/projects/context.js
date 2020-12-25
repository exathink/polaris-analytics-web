// @flow
import React from 'react';
import {FormattedMessage} from 'react-intl.macro';

import FourZeroFour from "../../../containers/Page/404";
import type {Context} from '../../framework/navigation/context/context';

import Wip from './wip/topic';
import Flow from './flow/topic';
import Repositories from './repositories/topic';
import Contributors from './contributors/topic';
import History from './history/topic';
import Trends from "./trends/topic";
import Configure from "./configure/topic";

import {Contexts} from "../../meta/contexts";

import {VALUE_STREAM_CONFIG} from "../../../config/featureFlags";

import {instanceMatchPattern} from "../../framework/navigation/context/helpers";


const messages = {
  instanceDisplay: (instanceName) => (
    <FormattedMessage
      id="contexts.projects.instance"
      defaultMessage="Value Stream: {instance}"
      values={{instance: instanceName}}/>
  )
};

const context : Context = {
  ...Contexts.projects,
  hidden: true,
  routes: [
    {
      match: `${instanceMatchPattern('project')}`,
      context: {
        ...Contexts.projects,
        display: match => messages.instanceDisplay(match.params.project),
        routes: [
          {
            match: 'wip',
            topic: Wip
          },
          {
            match: 'flow',
            topic: Flow
          },
          {

            match: 'trends',
            topic: Trends
          },
          {
            match: 'repositories',
            topic: Repositories
          },
          {
            match: 'contributors',
            topic: Contributors
          },
          {
            match: 'history',
            topic: History
          },
          {
            match: 'configure',
            requiredFeatures: [VALUE_STREAM_CONFIG],
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


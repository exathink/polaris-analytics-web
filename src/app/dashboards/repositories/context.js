import React from 'react';
import {FormattedMessage} from 'react-intl';

import FourZeroFour from "../../../containers/Page/404";
import type {Context} from '../../framework/navigation/context/context';

import Activity from './activity/topic';
import Contributor from './contributors/topic';
import History from './history/topic';

import {Contexts} from "../../meta/contexts";
import {instanceMatchPattern} from "../../framework/navigation/context/helpers";


const messages = {
  instanceDisplay: (instanceName) => (
    <FormattedMessage
      id="contexts.repositories.instance"
      defaultMessage="Repository: {instance}"
      values={{instance: instanceName}}/>
  )
};

const context : Context = {
  ...Contexts.repositories,
  hidden: true,
  routes: [
    {
      match: `${instanceMatchPattern('repository')}`,
      context: {
        ...Contexts.repositories,
        display: match => messages.instanceDisplay(match.params.repository),
        routes: [
          {
            match: 'activity',
            topic: Activity
          },
          {
            match: 'contributors',
            topic: Contributor
          },
          {
            match: 'history',
            topic: History
          },
          {
            match: '',
            redirect: 'activity'
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


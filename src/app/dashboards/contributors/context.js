import React from 'react';
import {FormattedMessage} from 'react-intl';

import FourZeroFour from "../../../containers/Page/404";
import type {Context} from '../../framework/navigation/context/context';

import Activity from './activity/topic';
import {Contexts} from "../../meta/contexts";
import {Topics} from "../../meta/topics";
import {instanceMatchPattern} from "../../framework/navigation/context/helpers";


const messages = {
  instanceDisplay: (instanceName) => (
    <FormattedMessage
      id="contexts.contributors.instance"
      defaultMessage="Contributor: {instance}"
      values={{instance: instanceName}}/>
  )
};

const context : Context = {
  ...Contexts.contributors,
  hidden: true,
  routes: [
    {
      match: `${instanceMatchPattern('contributor')}`,
      context: {
        ...Contexts.contributors,
        display: match => messages.instanceDisplay(match.params.contributor),
        routes: [
          {
            match: 'activity',
            topic: Activity
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


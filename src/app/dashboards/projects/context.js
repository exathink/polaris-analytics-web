// @flow
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
      id="contexts.projects.instance"
      defaultMessage="Project: {instance}"
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
            match: 'activity',
            topic: Activity
          },
          {
            match: 'contributors',
            topic: {
              ...Topics.contributors,
              routes: [
                {
                  match: '',
                  render: () => null
                }
              ]
            }
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


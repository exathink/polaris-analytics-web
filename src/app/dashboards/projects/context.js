// @flow
import React from 'react';
import {FormattedMessage} from 'react-intl';
import FourZeroFour from "../../../containers/Page/404";
import type {Context} from '../../navigation/context';

import Activity from './activity/topic';
import {Contexts} from "../../meta/contexts";
import {Topics} from "../../meta/topics";

const context : Context = {
  ...Contexts.project,
  hidden: true,
  routes: [
    {
      match: ':project',
      context: {
        name: 'project',
        display:
          (match) => (
            <FormattedMessage
              id="contexts.projects.instance"
              defaultMessage={'Project: {project}'}
              values={{project: match.params.project}}
            />
          ),
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


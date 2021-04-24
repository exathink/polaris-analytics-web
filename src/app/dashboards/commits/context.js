import React from 'react';
import {FormattedMessage} from 'react-intl.macro';

import FourZeroFour from "../../../containers/Page/404";
import type {Context} from '../../framework/navigation/context/context';

import Commit from './commit/topic';


import {Contexts} from "../../meta/contexts";

import {instanceMatchPattern} from "../../framework/navigation/context/helpers";


const messages = {
  instanceDisplay: (instanceName) => (
    <FormattedMessage
      id="contexts.commits.instance"
      defaultMessage="Commit: {instance}"
      values={{instance: instanceName}}/>
  )
};

const context : Context = {
  ...Contexts.commits,
  hidden: true,
  routes: [
    {
      match: `${instanceMatchPattern('commit')}`,
      context: {
        ...Contexts.commits,
        display: match => messages.instanceDisplay(match.params.commit),
        routes: [
          {
            match: 'commit',
            topic: Commit
          },
          {
            match: '',
            redirect: 'commit'
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


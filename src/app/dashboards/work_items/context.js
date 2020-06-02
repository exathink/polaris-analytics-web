import React from 'react';
import {FormattedMessage} from 'react-intl';

import FourZeroFour from "../../../containers/Page/404";
import type {Context} from '../../framework/navigation/context/context';

import WorkItem from './work_item/topic';


import {Contexts} from "../../meta/contexts";

import {instanceMatchPattern} from "../../framework/navigation/context/helpers";


const messages = {
  instanceDisplay: (instanceName) => (
    <FormattedMessage
      id="contexts.work_items.instance"
      defaultMessage="Work Item: {instance}"
      values={{instance: instanceName}}/>
  )
};

const context : Context = {
  ...Contexts.work_items,
  hidden: true,
  routes: [
    {
      match: `${instanceMatchPattern('work_item')}`,
      context: {
        ...Contexts.work_items,
        display: match => messages.instanceDisplay(match.params.work_item),
        routes: [
          {
            match: 'work_item',
            topic: WorkItem
          },
          {
            match: '',
            redirect: 'work_item'
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


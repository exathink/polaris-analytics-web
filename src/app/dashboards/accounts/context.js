// @flow
import Activity from './activity/topic';
import Contributors from './contributors/topic';

import type {Context} from '../../framework/navigation/context/context';
import {Contexts} from "../../meta/contexts";

const context: Context = {
  ...Contexts.accounts,
  display: () => `Account`,
  routes: [
    {
      match: 'activity',
      topic: Activity
    },
    {
      match: 'contributors',
      topic: Contributors
    },
    {
      match:'',
      redirect:'activity'
    }
  ]
};

export default context;






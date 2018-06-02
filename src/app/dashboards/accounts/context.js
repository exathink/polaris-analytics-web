// @flow
import Wip from "../../../containers/Page/wip";
import Activity from './activity/topic';
import {Topics} from "../../meta/topics";
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
      topic: {
        ...Topics.contributors,
        routes: [
          {
            match: '',
            component: Wip
          }
        ]
      }
    },
    {
      match:'',
      redirect:'activity'
    }
  ]
};

export default context;






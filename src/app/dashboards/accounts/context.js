// @flow
import Wip from "../../../containers/Page/wip";
import Organizations from '../organizations/context';
import Projects from '../projects/context';
import Activity from './activity/topic';
import {Topics} from "../../meta/topics";
import type {Context} from '../../navigation/context';

import {Contexts} from "../../meta/contexts";

const context: Context = {
  ...Contexts.accounts,
  display: () => `Account`,
  routes: [
    {
      match: 'organizations',
      context: Organizations
    },
    {
      match: 'projects',
      context: Projects
    },
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






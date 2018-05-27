// @flow
import Wip from "../../../containers/Page/wip";
import Organizations from '../organizations/context';
import Activity from './activity/topic';
import {Topics} from "../../meta/topics";
import type {Context} from '../../navigation/context';


const context: Context = {
  name: 'account',
  display: () => `Account`,
  routes: [
    {
      match: 'organizations',
      context: Organizations
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






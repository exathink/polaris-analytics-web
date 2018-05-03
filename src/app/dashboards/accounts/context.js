// @flow
import asyncComponent from "../../../helpers/AsyncFunc";
import Wip from "../../../containers/Page/wip";
import Organizations from '../organizations/context';

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
      topic: true,
      match: 'activity',
      component: asyncComponent(() => import('./activity_dashboard'))
    },
    {
      topic: true,
      match: 'contributors',
      component: Wip
    },
    {
      match:'',
      redirect:'activity'
    }
  ]
};

export default context;






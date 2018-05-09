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
      match: 'activity',
      topic: {
        name: 'activity',
        routes: [
          {
            match: '',
            component: asyncComponent(() => import('./activity_dashboard'))
          }
        ]
      }

    },
    {

      match: 'contributors',
      topic: {
        name: 'contributors',
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






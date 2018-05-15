// @flow
import FourZeroFour from "../../../containers/Page/404";
import type {Context} from '../../navigation/context';

import Activity from './activity/topic';

const context : Context = {
  name: 'Projects',
  hidden: true,
  routes: [
    {
      match: ':project',
      context: {
        name: 'project',
        display: (match) => `Project: ${match.params['project']}`,
        routes: [
          {
            match: 'activity',
            topic: Activity
          },
          {
            match: 'contributors',
            topic: {
              name: 'contributors',
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


// @flow
import asyncComponent from "../../../helpers/AsyncFunc";
import FourZeroFour from "../../../containers/Page/404";
import type {Context} from '../../navigation/context';


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


import asyncComponent from "../../../helpers/AsyncFunc";
import Wip from "../../../containers/Page/wip";
import FourZeroFour from "../../../containers/Page/404";
import Projects from "../projects/context";


const context = {
  name: 'organizations',
  hidden: true,
  routes: [
    {
      match: ':organization',
      context: {
        name: 'organization',
        display: (match) => `Organization: ${match.params['organization']}`,
        routes: [
          {
            match: 'projects',
            context: Projects
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
import React from 'react';
import asyncComponent from "../../../helpers/AsyncFunc";
import Wip from "../../../containers/Page/wip";
import FourZeroFour from "../../../containers/Page/404";
import Projects from "../projects/projects";
import {buildRouter} from "../routes";




const routeTree = {
  context: 'organizations',
  hidden: true,
  routes: [
    {
      match: ':organization',
      routes: {
        context: 'organization',
        routes: [
          {
            match: 'projects',
            component: Projects
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

const OrganizationsRouter = buildRouter(routeTree);

class Organizations extends React.Component {

  render() {
    return (
      <OrganizationsRouter {...this.props}/>
    );
  }
}

export default Organizations;
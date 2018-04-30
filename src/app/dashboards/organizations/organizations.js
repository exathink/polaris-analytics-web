import React from 'react';
import asyncComponent from "../../../helpers/AsyncFunc";
import Wip from "../../../containers/Page/wip";
import FourZeroFour from "../../../containers/Page/404";
import Projects from "../projects/projects";
import {buildRouter} from "../routes";




const routeTree = {
  context: 'Organizations',
  hidden: true,
  routes: [
    {
      match: ':organization',
      routes: {
        context: 'Organization',
        routes: [
          {
            match: 'projects',
            component: Projects
          },
          {
            match: 'activity',
            component: asyncComponent(() => import('./activity_dashboard'))
          },
          {
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
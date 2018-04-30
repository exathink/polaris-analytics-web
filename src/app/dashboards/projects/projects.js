import React from 'react';
import asyncComponent from "../../../helpers/AsyncFunc";
import FourZeroFour from "../../../containers/Page/404";
import {buildRouter} from "../routes";



const routeTree = {
  context: 'Projects',
  hidden: true,
  routes: [
    {
      match: ':project',
      routes: {
        context: 'Project',
        routes: [
          {
            match: 'activity',
            component: asyncComponent(() => import('./activity_dashboard'))
          },
          {
            match: 'contributors',
            render: () => null
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

const ProjectsRouter = buildRouter(routeTree);

class Projects extends React.Component {

  render() {
    return(
      <ProjectsRouter {...this.props}/>
    );
  }
}



export default Projects;


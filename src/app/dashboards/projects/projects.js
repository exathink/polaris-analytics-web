import React from 'react';
import asyncComponent from "../../../helpers/AsyncFunc";
import FourZeroFour from "../../../containers/Page/404";
import {contextRouterFor} from "../../navigation/contextRouter";



const context = {
  name: 'Projects',
  hidden: true,
  routes: [
    {
      match: ':project',
      context: {
        name: 'project',
        routes: [
          {
            topic: true,
            match: 'activity',
            component: asyncComponent(() => import('./activity_dashboard'))
          },
          {
            topic: true,
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

const ProjectsRouter = contextRouterFor(context);

class Projects extends React.Component {

  render() {
    return(
      <ProjectsRouter {...this.props}/>
    );
  }
}



export default Projects;


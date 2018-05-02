import React from 'react';
import asyncComponent from "../../../helpers/AsyncFunc";
import FourZeroFour from "../../../containers/Page/404";
import {buildRouter} from "../../navigation/contextRouter";



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

const ProjectsRouter = buildRouter(context);

class Projects extends React.Component {

  render() {
    return(
      <ProjectsRouter {...this.props}/>
    );
  }
}



export default Projects;


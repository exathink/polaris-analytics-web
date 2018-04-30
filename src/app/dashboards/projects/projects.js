import React from 'react';
import asyncComponent from "../../../helpers/AsyncFunc";


import {connect} from 'react-redux';
import sidebarActions from "../../containers/redux/sidebar/actions";
import FourZeroFour from "../../../containers/Page/404";
import {buildRouter} from "../routes";

const {pushTopics, popTopics} = sidebarActions;


const routeTree = {
  context: 'Projects',
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

  componentWillMount() {
    const {match, setTopics} = this.props;
    setTopics([
      {
        name: 'activity',
        link: `${match.url}/activity`
      },
      {
        name: 'contributors',
        link: `${match.url}/contributors`
      }
    ])
  }

  componentWillUnmount() {
    const {clearTopics} = this.props;
    clearTopics();
  }

  render() {
    return(
      <ProjectsRouter {...this.props}/>
    );
  }
}



export default connect(null, {setTopics: pushTopics, clearTopics: popTopics} )(Projects);


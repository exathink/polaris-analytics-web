import React from 'react';
import asyncComponent from "../../../helpers/AsyncFunc";
import Wip from "../../../containers/Page/wip";

import {connect} from 'react-redux';
import sidebarActions from "../../containers/redux/sidebar/actions";
import FourZeroFour from "../../../containers/Page/404";
import Projects from "../projects/projects";
import {buildRouter} from "../routes";

const {pushTopics, popTopics} = sidebarActions;


const routeTree = {
  context: 'Organizations',
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

  componentWillMount() {
    this.updateTopics();
  }


  updateTopics() {
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
    return (
      <OrganizationsRouter {...this.props}/>
    );
  }
}

export default connect(null, {setTopics: pushTopics, clearTopics: popTopics})(Organizations);
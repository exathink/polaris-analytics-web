import React from 'react';
import asyncComponent from "../../../helpers/AsyncFunc";
import {Route, Switch, Redirect} from 'react-router-dom';
import Wip from "../../../containers/Page/wip";

import {connect} from 'react-redux';
import sidebarActions from "../../containers/redux/sidebar/actions";
import FourZeroFour from "../../../containers/Page/404";
const {setTopics, clearTopics} = sidebarActions;

class Project_ extends React.Component {

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
    const {match} = this.props;
    return(
      <Switch>
        <Route
          path={`${match.path}/activity`}
          component={asyncComponent(() => import('./activity_dashboard'))}
        />
        <Route
          path={`${match.path}/contributors`}
          component={Wip}
        />
        <Route
          exact path={`${match.path}`}
          component={() => <Redirect to={`${match.url}/activity`}/>}
        />
        <Route
          component={FourZeroFour}
        />
      </Switch>
    );
  }
}

class Projects extends React.Component {

  render() {
    const {match} = this.props;
    return(
      <Switch>
        <Route
          path={`${match.path}/:project`}
          component={Project}
        />
        <Route
          component={FourZeroFour}
        />
      </Switch>
    );
  }
}



const Project = connect(null, {setTopics, clearTopics} )(Project_);
export default Projects;

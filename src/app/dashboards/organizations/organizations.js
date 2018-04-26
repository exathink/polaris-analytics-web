import React from 'react';
import asyncComponent from "../../../helpers/AsyncFunc";
import {Route, Switch, Redirect} from 'react-router-dom';
import Wip from "../../../containers/Page/wip";

import {connect} from 'react-redux';
import sidebarActions from "../../containers/redux/sidebar/actions";
import FourZeroFour from "../../../containers/Page/404";
import Projects from "../projects/projects";
const {pushTopics, popTopics} = sidebarActions;

class Organizations extends React.Component {

  render() {
    const {match} = this.props;
    return(
      <Switch>
        <Route
          path={`${match.path}/:organization`}
          component={Organization}
        />
        <Route
          component={FourZeroFour}
        />
      </Switch>
    );
  }
}

class Organization_ extends React.Component {

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
    const {match} = this.props;
    return(
      <Switch>
        <Route
          path={`${match.path}/projects`}
          component={Projects}
        />
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

const Organization = connect(null, {setTopics: pushTopics, clearTopics: popTopics} )(Organization_);

export default connect(null, {setTopics: pushTopics, clearTopics: popTopics} )(Organizations);
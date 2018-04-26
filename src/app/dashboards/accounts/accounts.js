import React from 'react';
import asyncComponent from "../../../helpers/AsyncFunc";
import {Route, Switch, Redirect} from 'react-router-dom';
import Wip from "../../../containers/Page/wip";
import Organizations from '../organizations/organizations';

import {connect} from 'react-redux';
import sidebarActions from "../../containers/redux/sidebar/actions";
const {setTopics, clearTopics} = sidebarActions;



class Accounts extends React.Component {

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
          path={`${match.path}/organizations`}
          component={Organizations}
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
          component={() => <Redirect to={`${match.path}/activity`}/>}
        />
      </Switch>
    );
  }
}


export default connect(null, {setTopics, clearTopics} )(Accounts);
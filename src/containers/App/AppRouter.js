import React from 'react';
import { Switch, Route } from 'react-router-dom';
import asyncComponent from '../../helpers/AsyncFunc';

class AppRouter extends React.Component {
  render() {
    const { url } = this.props;
    return (
      <Switch>
        <Route
          path={`${url}/`}
          component={asyncComponent(() => import('../dashboard'), this.props)}
        />
        <Route
          exact
          path={`${url}/blankPage`}
          component={asyncComponent(() => import('../blankPage'), this.props)}
        />
      </Switch>
    );
  }
}

export default AppRouter;

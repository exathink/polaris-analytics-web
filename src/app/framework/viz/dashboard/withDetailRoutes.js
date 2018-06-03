import React from 'react';
import {Route,Switch} from 'react-router-dom';
export const withDetailRoutes = (WrappedDashboard) => {
  return ({match, ...rest}) => (
    <Switch>
      <Route
        path={`${match.path}/:selected`}
        component={(props) => (
          <WrappedDashboard itemSelected={true} dashboardUrl={match.url} {...{...rest, ...props}}/>)}
      />
      <Route
        component={(props) => (
          <WrappedDashboard itemSelected={false} dashboardUrl={match.url} {...{...rest, ...props}}/>)}
      />
    </Switch>
  );
};
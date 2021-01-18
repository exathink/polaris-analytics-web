import React from "react";
import {Route, Switch} from "react-router-dom";
export const withDetailRoutes = (WrappedDashboard) => {
  return ({match, ...rest}) => (
    <Switch>
      <Route path={`${match.path}/:selected`}>
        <WrappedDashboard itemSelected={true} dashboardUrl={match.url} {...rest} />
      </Route>
      <Route>
        <WrappedDashboard itemSelected={false} dashboardUrl={match.url} {...rest} />
      </Route>
    </Switch>
  );
};
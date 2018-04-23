import React from 'react';
import { Switch, Route, Redirect} from 'react-router-dom';
import {DashboardContainer} from "./dashboards/activity/dashboardRouter";



const AppRouter = (props) => {
  const {match} = props;
  return (
    <Switch>
      <Route
        path={`${match.path}/dashboard`}
        component={DashboardContainer}
      />
      <Redirect
        to={`${match.path}/dashboard`}
      />
    </Switch>
  )
};
export default AppRouter;

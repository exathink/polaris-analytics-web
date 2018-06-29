import React from 'react';
import { Switch, Route, Redirect} from 'react-router-dom';
import DashboardContainer from "./dashboards/dashboardRouter";
import {Setup} from "./admin/components/setup";



const AppRouter = (props) => {
  const {match} = props;
  return (
    <Switch>
      <Route
        path={`${match.path}/setup`}
        component={Setup}
      />
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

import React from 'react';

import {Route, Switch, withRouter} from 'react-router-dom';


export default withRouter(() => (
  <Switch>
    <Route
      path={'/app/dashboard/:aspect/organizations/:organization'}
      render={(props) => <h3 className={"isoLeft"}>Organization: {`${props.match.params.organization}`}</h3>}
    />
    <Route
      path={'/app/dashboard/:aspect/projects/:organization/:project'}
      render={(props) => <h3 className={"isoLeft"}>Project: {`${props.match.params.project}`}</h3>}
    />
    <Route
      path={'/app/dashboard/:aspect/repositories/:organization/:project/:repository'}
      render={(props) => <h3 className={"isoLeft"}>Repository: {`${props.match.params.repository}`}</h3>}
    />

    <Route
      render={(props) => {
        console.log(props);
        return null;
      }}
    />

  </Switch>
));




import React from 'react';
import { Route, Switch} from 'react-router-dom';
import { ConnectedRouter } from 'react-router-redux';


import App from './containers/App/App';
import {Login, Logout, PrivateRoute} from './auth';


export default ({ history}) => {
  return (
    <ConnectedRouter history={history}>
        <Switch>
            <Route path="/login" component={Login} />
            <Route path="/logout" component={Logout} />
            <PrivateRoute exact path="/app" component={App} />
            {/* This is a direct example of a private route that can assume that user and account is injected into its props */}
            <PrivateRoute exact path="/foo" component={(props) => (<h3>Hello {props.user.last_name} from {props.account.company}</h3>)} />
        </Switch>
    </ConnectedRouter>
  );
};



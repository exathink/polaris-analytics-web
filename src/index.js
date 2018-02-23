import React from 'react';
import { render } from 'react-dom';
import { Route } from 'react-router';
import { Provider } from 'react-redux';
import createHistory from 'history/createBrowserHistory';
import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { ConnectedRouter, routerReducer, routerMiddleware } from 'react-router-redux';

import './index.css';
import App from './App';
import Repos from './repos/components';
import Login from './auth/components/Login';
import Authenticated from './auth/components/Authenticated';

const history = createHistory();
const middleware = routerMiddleware(history);
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(
  combineReducers({
    router: routerReducer
  }),
  composeEnhancers(applyMiddleware(middleware))
)

render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <div>
          <Route exact path="/login" component={Login} />
          <Route exact path="/" component={Authenticated(App)} />
          <Route exact path="/repos" component={Authenticated(Repos)} />
      </div>
    </ConnectedRouter>
  </Provider>,
  document.getElementById('root')
);

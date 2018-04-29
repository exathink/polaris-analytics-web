import React from 'react';
import {Redirect, Route, Switch} from 'react-router-dom';


export const buildRouter = (routeTree, path = '') => {
  return class RouterNode extends React.Component {

    buildRoutes() {
      const {match} = this.props;
      return routeTree.routes.map(
        route => {
          if (route.match === null) {
            throw new Error(`Route did not specify a match property`)
          }
          const terminal =
            route.component ? {component: route.component} :
              route.render ? {render: route.render} :
                route.redirect ? {render: () => <Redirect to={`${match.url}/${route.redirect}`}/>} :
                  null;

          // This is the child component displayed at this path. May be null.
          const terminalRoute =
            terminal != null ?
              route.match.length > 1 ?
                <Route
                  key={`${route.match} (terminal)`}
                  path={`${match.path}/${route.match}`}
                  {...terminal}
                /> :
                // Empty string match pattern: use exact match to base match path
                <Route
                  key={`${route.match} (terminal)`}
                  exact path={`${match.path}`}
                  {...terminal}
                /> :
              null;

          // This recursively builds the route for the routes that are rooted at this path. May be null
          const childRouter =
            route.routes ?
              <Route
                key={`${route.match} (childRouter)`}
                path={`${match.path}/${route.match}`}
                component={buildRouter(route.routes, `${path}/${route.match}`)}
              /> :
              null;

          if (terminalRoute || childRouter) {
            if (terminalRoute && childRouter) {
              throw new Error(`Route must specify at most one of the attributes [component, render, redirect, routes]`);
            }
            return terminalRoute || childRouter
          } else {
            throw new Error(`Route must specify at least one of the attributes [component, render, redirect, routes]`);
          }
        }
      );
    }

    render() {
      if (routeTree.routes != null) {
        const {match} = this.props;
        return (
          <Switch key={`RouterNode: ${match.path}`}>
            {this.buildRoutes()}
          </Switch>
        );
      }
    }
  }
};







import React from 'react';
import {Redirect, Route, Switch} from 'react-router-dom';


export const buildRoutes = (routeTree, path = '') => (
  props => {
    const {match} = props;

    if (routeTree.routes != null) {
      return React.createElement(
        Switch,
        {},
        ...routeTree.routes.map(
          route => {
            if (route.match === null) {
              throw new Error(`Route did not specify a match property`)
            }
            const target =
              route.component ? {component: route.component} :
                route.render ? {render: route.render} :
                  route.redirect ? {render: () => <Redirect to={`${match.url}/${route.redirect}`}/>} :
                    null;

            // This is the child component displayed at this path. May be null.
            const targetRoute =
              target != null ?
                route.match.length > 1 ?
                  <Route
                    key={`${route.match}.target`}
                    path={`${match.path}/${route.match}`}
                    {...target}
                  /> :
                  // Empty string match pattern: use exact match to base match path
                  <Route
                    key={`${route.match}.target`}
                    exact path={`${match.path}`}
                    {...target}
                  /> :
                null;

            // This recursively builds the route for the routes that are rooted at this path. May be null
            const childRouter =
              route.routes ?
                <Route
                  key={`${route.match}.childRouter`}
                  path={`${match.path}/${route.match}`}
                  render={buildRoutes(route.routes, `${path}/${route.match}`)}
                /> :
                null;

            if (targetRoute || childRouter) {
              if (targetRoute && childRouter) {
                //throw new Error(`Route must specify exactly one of target component or child routes`);
              }
              return targetRoute || childRouter
            } else {
              throw new Error(`Route must specify either a target or child routes`);
            }
          }
        )
      )
    }
  }
);






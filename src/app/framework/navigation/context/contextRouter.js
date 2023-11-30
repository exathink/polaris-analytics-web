/// @flow
import * as React from 'react';
import {Redirect, Route, Switch} from 'react-router-dom';

import type {Context} from './context';
import {withViewerContext} from "../../viewer/viewerContext";
import AppContext from "../../../context";

export const buildContextRouter = (context: Context, viewerContext: any = null, path: string = '') : React.ComponentType<any>  => {
  return class extends React.Component<any> {

    // to support grouping in context menus, we started
    // allowing non routable elements in the route tree.
    // these need to be removed before creating the route tree
    // from this node.
    filterNonRoutable(routes) {
      return routes.filter(
        route => (route.group === undefined)
      )

    }

    flatten(routes) {
      const flattened = routes.reduce(
        (flattened, route) =>
          route.submenu != null ?
            [...flattened, ...route.routes]
            :
            [...flattened, route],
        []
      )
      return flattened;
    }

    buildRoutes() {
      const {match} = this.props;
      return this.flatten(this.filterNonRoutable(context.routes)).map(
        (route: any, index: number) => {
          if (route.match === null) {
            throw new Error(`Route did not specify a match property`)
          }
          if(route.allowedRoles != null  && !viewerContext.hasSystemRoles(route.allowedRoles)) {
            // dont render this into the route tree if the user does not have the required roles.
            return null;
          }
          if(route.requiredFeatures != null  &&
              !route.requiredFeatures.every(viewerContext.isFeatureFlagActive)) {
            // dont render this into the route tree if the specified feature flags are not enabled for the user.
            return null;
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
                  exact={route.exact != null ? route.exact : true}
                  {...terminal}
                /> :
                // Empty string match pattern
                <Route
                  key={`${route.match} (terminal)`}
                  path={`${match.path}`}
                  {...terminal}
                /> :
              null;

          // This recursively builds the route for a child context or topic that is rooted at this path. May be null
          const childContext = route.context || route.topic;

          const childRouter =
            childContext ?
              <Route
                key={`${route.match} (childRouter)`}
                path={`${match.path}/${route.match}`}
                component={buildContextRouter(childContext, viewerContext, `${path}/${route.match}`)}
              /> :
              null;

          if (terminalRoute || childRouter) {
            if (terminalRoute && childRouter) {
              throw new Error(`Route must specify at most one of the attributes [component, render, redirect, context]`);
            }
            return terminalRoute || childRouter
          } else {
            throw new Error(`Route must specify at least one of the attributes [component, render, redirect, context]`);
          }
        }
      );
    }

    render() {
      if (context.routes != null) {
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



export const getContextRouterFor = (context:Context, path:string ='') => withViewerContext(
  props => React.createElement(buildContextRouter(AppContext, props.viewerContext), props)
)

/// @flow
import * as React from 'react';
import {Redirect, Route, Switch} from 'react-router-dom';

import type {Context} from './context';
import {withViewerContext, verifyRoles} from "../../viewer/viewerContext";
import AppContext from "../../../context";

export const buildContextRouter = (context: Context, viewer: any = null, path: string = '') : React.ComponentType<any>  => {
  return class extends React.Component<any> {



    buildRoutes() {
      const {match} = this.props;
      return context.routes.map(
        (route: any, index: number) => {
          if (route.match === null) {
            throw new Error(`Route did not specify a match property`)
          }
          if(route.allowedRoles != null  && !verifyRoles(viewer, route.allowedRoles)) {
            // dont render this into the route tree if the user does not have the required roles.
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
                component={buildContextRouter(childContext, viewer, `${path}/${route.match}`)}
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
  props => React.createElement(buildContextRouter(AppContext, props.viewerContext.viewer), props)
)










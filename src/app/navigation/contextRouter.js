// @flow
import * as React from 'react';
import {Redirect, Route, Switch} from 'react-router-dom';
import {connect} from 'react-redux';
import routeActions from '../redux/navigation/actions';

import type {Context, RouteType} from './context';
import {ActiveContext} from "./context";


export const contextRouterFor = (context: Context, path: string = '') : React.ComponentType<any>  => {
  return class extends React.Component<any> {

    buildRoutes() {
      const {match} = this.props;
      return context.routes.map(
        (route: RouteType, index: number) => {
          if (route.match === null) {
            throw new Error(`Route did not specify a match property`)
          }
          const terminal =
            route.component ? {component: withNavigationUpdates(context, index, match)(route.component)} :
              route.render ? {component: withNavigationUpdates(context, index, match)(route.render)} :
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

          // This recursively builds the route for a child context that is rooted at this path. May be null
          const childRouter =
            route.context ?
              <Route
                key={`${route.match} (childRouter)`}
                path={`${match.path}/${route.match}`}
                component={withNavigationUpdates(context, index, match)(contextRouterFor(route.context, `${path}/${route.match}`))}
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

const {pushRoute, popRoute} = routeActions;

export const withNavigationUpdates = (context: Context, index: number, match: any) => {
  return (Router: React.ComponentType<any>) => {
    return (
      connect(null, {pushRoute, popRoute})(
        class extends React.Component<any> {

          componentWillMount() {
            this.props.pushRoute(
              new ActiveContext(context, index, match)
            );
          }
          componentWillUnmount() {
            this.props.popRoute();
          }
          render() {
            return <Router {...this.props}/>
          }
        }
      )
    )
  }
};












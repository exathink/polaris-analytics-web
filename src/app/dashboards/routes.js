import React from 'react';
import Wip from "../../containers/Page/wip";
import asyncComponent from "../../helpers/AsyncFunc";
import {Route, Switch, Redirect} from 'react-router-dom';
import {flatMap} from 'lodash';

import FourZeroFour from "../../containers/Page/404";


const routeTree = {
  routes: [
    {
      match: 'account',
      routes: {
        routes: [
          {
            match: 'activity',
            component: asyncComponent(() => import('./accounts/activity_dashboard'))
          },
          {
            match: 'contributors',
            component: Wip
          },
          {
            match: 'organizations/:organization',
            routes: {
              routes: [
                {
                  match: 'activity',
                  component: asyncComponent(() => import('./organizations/activity_dashboard'))
                },
                {
                  match: 'contributors',
                  render: () => <Wip/>
                },
                {
                  match: 'projects/:project',
                  routes: {
                    routes: [
                      {
                        match: 'activity',
                        component: asyncComponent(() => import('./projects/activity_dashboard'))
                      },
                      {
                        match: 'contributors',
                        render: () => null
                      },
                      {
                        match: '',
                        redirect: 'activity'
                      }
                    ]
                  }
                },
                {
                  match: '',
                  redirect: 'activity'
                }
              ]
            }
          },
          {
            match: '',
            redirect: 'activity'
          }
        ]
      }
    },
    {
      match: '',
      redirect: 'account'
    }
  ]
};


const buildRoutes = (routeTree, path = '') => (
  props => {
    const {match} = props;

    if (routeTree.routes != null) {
      return React.createElement(
        Switch,
        {},
        ...flatMap(routeTree.routes,
          routes => {
            const pattern =
              routes.match != null ?
                (routes.match.length > 0 ? `${match.path}/${routes.match}` : `${match.path}`) :
                null;
            if (pattern === null) {
              throw new Error(`Route did not specify a match property`)
            }
            const target =
              routes.component ? {component: routes.component} :
                routes.render ? {render: routes.render} :
                  routes.redirect ? {render: () => <Redirect to={`${match.url}/${routes.redirect}`}/>} :
                    null;

            // This is the child component displayed at this path. May be null.
            const targetRoute = target != null ?
              [
                <Route
                  key={`${routes.match}.target`}
                  path={pattern}
                  {...target}
                />
              ]
              : [];

            // This recursively builds the route for the routes that are rooted at this path. May be null
            const childRouter = routes.routes ?
              [
                <Route
                  key={`${routes.match}.childRouter`}
                  path={pattern}
                  render={buildRoutes(routes.routes, `${path}/${routes.match}`)}
                />
              ]
              : [];

            return [...targetRoute, ...childRouter]
          }
        )
      )
    }
  }
);

export default buildRoutes(routeTree);




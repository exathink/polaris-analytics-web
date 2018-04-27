import React from 'react';
import Wip from "../../containers/Page/wip";
import asyncComponent from "../../helpers/AsyncFunc";
import {Route, Switch, Redirect} from 'react-router-dom';
import FourZeroFour from "../../containers/Page/404";


const routeTable = {
  rules: [
    {
      match: 'account',
      table: {
        rules: [
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
            table: {
              rules: [
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
                  table: {
                    rules: [
                      {
                        match: 'activity',
                        component: asyncComponent(() => import('./projects/activity_dashboard'))
                      },
                      {
                        match: 'contributors',
                        render: () => null
                      }
                    ],
                    default: 'activity'
                  }
                }
              ],
              default: 'activity'
            }
          }
        ],
        default: 'activity',
      }
    }
  ],
  default: 'accounts',
};


const buildRoutes = (route, path = '') => (
  props => {
    console.log(`Building routes from ${path}`);
    const {match} = props;
    const routes = route.rules ? route.rules.map(
      rule => {
        const target =
          rule.component ? {component: rule.component} :
            rule.render ? {render: rule.render} :
              rule.table ? {render: buildRoutes(rule.table, `${path}/${rule.match}`)} :
                null;

        if (target == null) {
          throw new Error(`Rule: ${rule.match} should specify one of the attributes [component, render, table]`)
        }
        return (
          <Route
            key={rule.match}
            path={`${match.path}/${rule.match}`}
            {...target}
          />
        )

      }
    ) : [];
    const defaultRoute = route.default ?
      <Route
        key={'default'}
        exact path={`${match.path}`}
        render={() => <Redirect to={`${match.url}/${route.default}`}/>}
      /> : null;
    if (defaultRoute != null) {
      routes.push(defaultRoute)
    }

    return React.createElement(Switch, {}, ...routes);
  }
);

const foo = buildRoutes(routeTable);
export default foo;

console.log(foo);



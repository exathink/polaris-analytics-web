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
      redirect: 'accounts'
    }
  ]
};


const buildRoutes = (routeTable, path = '') => (
  props => {
    const {match} = props;

    if (routeTable.rules != null) {
      return React.createElement(
        Switch,
        {},
        ...routeTable.rules.map(
          rule => {
            const pattern =
              rule.match != null ?
                (rule.match.length > 0 ? `${match.path}/${rule.match}` : `${match.path}`) :
                null;
            if (pattern === null) {
              throw new Error(`Rule did not specify a match property`)
            }
            const target =
              rule.component ? {component: rule.component} :
                rule.render ? {render: rule.render} :
                  rule.redirect ? {render: () => <Redirect to={`${match.url}/${rule.redirect}`}/>} :
                    rule.table ? {render: buildRoutes(rule.table, `${path}/${rule.match}`)} :
                      null;

            if (target === null) {
              throw new Error(`Rule: ${rule.match} does not specify any of the attributes [component, render, table, redirect]`)
            }
            return (
              <Route
                key={rule.match}
                path={pattern}
                {...target}
              />
            )
          }
        )
      )
    } else {
      throw new Error(`Route table for ${path} does not contain an attribute named 'rules'`);
    }
  }
);

const foo = buildRoutes(routeTable);
export default foo;

console.log(foo);



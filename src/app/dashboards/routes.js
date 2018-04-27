import React from 'react';
import Wip from "../../containers/Page/wip";
import asyncComponent from "../../helpers/AsyncFunc";
import {Route, Switch} from 'react-router-dom';
import FourZeroFour from "../../containers/Page/404";

const routeTable =  {
  level: 'accounts',
  topics: [
    {
      name: 'activity',
      component: asyncComponent(() => import('./accounts/activity_dashboard'))
    },
    {
      name: 'contributors',
      component: Wip
    }
  ],
  children: [
    {
      level: 'organizations',
      instance: {
        level: 'organizations',
        topics: [
          {
            name: 'activity',
            component: asyncComponent(() => import('./organizations/activity_dashboard'))
          }
        ],
        children: [
          {
            level: 'projects',
            instance: {
              level: 'organizations',
              topics: [
                {
                  name: 'activity',
                  component: asyncComponent(() => import('./organizations/activity_dashboard'))
                },
                {
                  name: 'contributors',
                  component: Wip
                }
              ]
            }
          }
        ]
      }
    }
  ]
};

const buildRoutes = (route) => (
  props => {
    const { match } = props;
    const topicLinks = route.topics ?  route.topics.map(
      topic => ({
        name: topic.name,
        link: `${match.url}/${topic.name}`
      })
    ) : [];

    const topicRoutes = route.topics ? route.topics.map(
      topic => (
        <Route
          path={`${match.path}/${topic.name}`}
          component={topic.component}
        />
      )
    ) : [];
    return(
      React.createElement(Switch, {}, ...topicRoutes)
    )
  }
);

export default buildRoutes(routeTable);


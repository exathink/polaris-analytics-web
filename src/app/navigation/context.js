// @flow

import * as React from 'react';

export type Context = {
  name: string,
  hidden?: boolean,
  routes: Array<RouteType>
}

export type RouteType =
  {
    match: string,
    render: React.ComponentType<any>
  }
  |
  {
    match: string,
    component: React.ComponentType<any>,
  }
  |
  {
    match: string,
    redirect: string
  }
  |
  {
    match: string,
    context: Context
  };




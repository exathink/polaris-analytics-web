// @flow

import * as React from 'react';


export type MatchType = {
  path: string,
  url: string,
  params: any
};


export type Context = {
  name: string,
  hidden?: boolean,
  display?: (match?: MatchType) => string,
  icon?: string,
  color?: string,
  routes: Array<{
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
    }
    |
    {
      match: string,
      topic: Context
    }
    >
}
// This duplicate def is a bit ugly, but it seems like
// forward declarations for a recursive type don't work too well with Flow.
// I get eslint errors and all sorts of intermittent flow failures when I do that.
// So I am declaring RouteType as a separate type, but with the same shape
// as the data type for the contents of the routes Array in context.

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
  }
  |
  {
    match: string,
    topic: Context
  };



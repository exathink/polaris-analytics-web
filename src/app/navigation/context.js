// @flow

import * as React from 'react';
import {getCurrentTheme} from '../themes/config';
import {themeConfig} from '../../config';


export type MatchType = {
  path: string,
  url: string,
  params: any
};


export type Context = {
  name: string,
  hidden?: boolean,
  display?: (match: MatchType) => string,
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
  };


export class ActiveContext {
  context: Context;
  selectedRoute: RouteType;
  matchInfo: MatchType;
  theme: {};

  constructor(context: Context, index: number, match: MatchType) {
    this.context = context;
    this.selectedRoute = context.routes[index];
    this.matchInfo = match;
    this.theme = getCurrentTheme('contextsTheme', themeConfig.theme)
  }

  name() {
    return this.context.name;
  }

  display() {
    return this.matchInfo.params[this.context.name]
  }

  color() {
    return this.theme[this.name()];
  }

  routes() {
    return this.context.routes;
  }

  target() {
    return `${this.selectedRoute.match}`
  }

  matchUrl() {
    return this.matchInfo.url;
  }

  targetUrl() {
    return `${this.matchUrl()}/${this.target()}`
  }

  urlFor(route: RouteType) {
    return `${this.matchInfo.url}/${route.match}`;
  }










}
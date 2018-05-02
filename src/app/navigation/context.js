// @flow

import * as React from 'react';

export type Context = {
  name: string,
  hidden?: boolean,
  // eslint-disable-next-line
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

export type MatchType = {
  path: string,
  url: string,
  params: any
};

export type ActiveContextType = {
  context: Context,
  selectedRoute: RouteType,
  match: MatchType
};


export class ActiveContext {
  context: Context;
  selectedRoute: RouteType;
  matchInfo: MatchType;

  constructor(context: Context, index: number, match: MatchType) {
    this.context = context;
    this.selectedRoute = context.routes[index];
    this.matchInfo = match
  }

  name() {
    return this.context.name;
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
// @flow

import * as React from 'react';

export type Context = {
  name: string,
  hidden?: boolean,
  routes: Array<
    {
      match: string,
      render: React.Node
    }
    |
    {
      match: string,
      component: React.Node,
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





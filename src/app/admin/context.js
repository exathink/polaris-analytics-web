import React from "react";
import type {Context} from "../framework/navigation/context/context";
import {Contexts, Topics} from "../meta";
import Accounts from './accounts/context';

const context: Context = {
  ...Contexts.admin,
  routes: [
    {
      match: 'accounts',
      context: Accounts
    },
    {
      match: '',
      redirect: 'accounts'
    }
  ]
};
export default context;
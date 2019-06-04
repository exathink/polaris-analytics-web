import React from "react";
import type {Context} from "../framework/navigation/context/context";
import {Contexts} from "../meta";
import System from './system/topic';
import Account from './account/topic';


const context: Context = {
  ...Contexts.settings,
  routes: [
    {
      match: 'account',
      topic: Account,
      allowedRoles: ['admin', 'account-owner']
    },
    {
      match: 'system',
      topic: System,
      allowedRoles: ['admin']
    },
    {
      match: '',
      redirect: 'account'
    }
  ]
};
export default context;


import React from "react";
import type {Context} from "../framework/navigation/context/context";

import {Contexts} from "../meta";
import {Topics} from '../meta';

import {FormattedMessage} from "react-intl";
import asyncComponent from "../../helpers/AsyncFunc";




const messages = {
  instanceDisplay: (instanceName) => (
    <FormattedMessage
      id="contexts.admin.accounts.instance"
      defaultMessage="Account: {instance}"
      values={{instance: instanceName}}/>
  )
};


const context: Context = {
  ...Contexts.admin,
  routes: [
    {
      match: '',
      component: () => 'Admin Context Root'
    }
  ]
};
export default context;
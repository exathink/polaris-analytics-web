import React from "react";
import type {Context} from "../../framework/navigation/context/context";

import {Contexts, Topics} from "../../meta";
import Manage from "./manage/topic"


const context: Context = {
  ...Contexts.accounts,
  routes: [
    {
      match: 'manage',
      topic: Manage
    },
    {
      match: '',
      redirect: 'manage'
    }
  ]
};
export default context;
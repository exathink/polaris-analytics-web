import type {Context} from "./framework/navigation/context/context";
import Dashboard from "./dashboards/context";
import DashboardTopic from "./dashboards/topic";
import Admin from "./admin/context";
import AdminTopic from "./admin/topic";


import asyncComponent from "../helpers/AsyncFunc";
import {Contexts, Topics} from "./meta";
import {NavCard} from "./components/cards";
import React from "react";

const context: Context = {
  name: 'app',
  hidden: false,
  routes: [
    {
      match: 'dashboard/.',
      context: Dashboard,
    },
    {
      match: 'dashboard',
      topic: DashboardTopic,
    },
    {
      match: 'admin/.',
      context: Admin,
      allowedRoles: ['admin']
    },
    {
      match: 'admin',
      topic: AdminTopic,
      allowedRoles: ['admin']
    },
    {
      match: '',
      redirect: 'dashboard'
    }
  ]
};

export default context;

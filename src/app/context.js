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
      match: 'topic/dashboard',
      topic: DashboardTopic,
    },
    {
      match: 'dashboard',
      context: Dashboard,
    },
    {
      match: 'topic/admin',
      topic: AdminTopic,
      allowedRoles: ['admin']
    },
    {
      match: 'admin',
      context: Admin,
      allowedRoles: ['admin']
    },
    {
      match: '',
      redirect: 'topic/dashboard'
    }
  ]
};

export default context;

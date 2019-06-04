import type {Context} from "./framework/navigation/context/context";
import Dashboard from "./dashboards/context";
import DashboardTopic from "./dashboards/topic";
import Admin from "./admin/context";
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
      match: 'admin',
      context: Admin,
    },
    {
      match: '',
      redirect: 'topic/dashboard'
    }
  ]
};

export default context;

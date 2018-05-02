// @flow
import React from 'react';
import asyncComponent from "../../../helpers/AsyncFunc";
import Wip from "../../../containers/Page/wip";
import Organizations from '../organizations/organizations';
import {buildRouter} from "../../navigation/contextRouter";


import type {Context} from '../../navigation/context';


const context : Context = {
  name: 'account',
  routes: [
    {
      match: 'organizations',
      component: Organizations
    },
    {
      topic: true,
      match: 'activity',
      component: asyncComponent(() => import('./activity_dashboard'))
    },
    {
      topic: true,
      match: 'contributors',
      component: Wip
    },
    {
      match:'',
      redirect:'activity'
    }
  ]
};

const AccountsRouter = buildRouter(context);

class Accounts extends React.Component<any> {

  render() {
    return(
      <AccountsRouter {...this.props}/>
    );
  }
}


export default Accounts;
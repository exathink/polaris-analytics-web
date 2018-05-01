import React from 'react';
import asyncComponent from "../../../helpers/AsyncFunc";
import Wip from "../../../containers/Page/wip";
import Organizations from '../organizations/organizations';
import {buildRouter} from "../routes";
import Icons from '../../helpers/icons';

const routeTree = {
  context: 'account',
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

const AccountsRouter = buildRouter(routeTree);

class Accounts extends React.Component {

  render() {
    return(
      <AccountsRouter {...this.props}/>
    );
  }
}


export default Accounts;
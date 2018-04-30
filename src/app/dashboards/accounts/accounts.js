import React from 'react';
import asyncComponent from "../../../helpers/AsyncFunc";
import Wip from "../../../containers/Page/wip";
import Organizations from '../organizations/organizations';
import {buildRouter} from "../routes";


const routeTree = {
  context: 'Account',
  routes: [
    {
      match: 'organizations',
      component: Organizations
    },
    {
      match: 'activity',
      component: asyncComponent(() => import('./activity_dashboard'))
    },
    {
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
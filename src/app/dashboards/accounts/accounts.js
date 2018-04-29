import React from 'react';
import asyncComponent from "../../../helpers/AsyncFunc";
import Wip from "../../../containers/Page/wip";
import Organizations from '../organizations/organizations';

import {connect} from 'react-redux';
import sidebarActions from "../../containers/redux/sidebar/actions";
import {buildRouter} from "../routes";

const {pushTopics, popTopics} = sidebarActions;


const routeTree = {
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

  componentWillMount() {
      const {match, setTopics} = this.props;
      setTopics([
        {
          name: 'activity',
          link: `${match.url}/activity`
        },
        {
          name: 'contributors',
          link: `${match.url}/contributors`
        }
      ])
  }

  componentWillUnmount() {
    const {clearTopics} = this.props;
    clearTopics();
  }

  render() {
    return(
      <AccountsRouter {...this.props}/>
    );
  }
}


export default connect(null, {setTopics: pushTopics, clearTopics: popTopics} )(Accounts);
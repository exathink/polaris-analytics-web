import './dashboard.css';
import LayoutWrapper from '../../components/utility/layoutWrapper';
import FullscreenBtn from '../../components/buttons/FullscreenBtn';
import FourZeroFour from "../../containers/Page/404";
import React from "react";
import { Switch, Route, Redirect} from 'react-router-dom';

import AccountRouter from './accounts/accounts';

import Routes from './routes';

export class DashboardsRouter extends React.Component {
  render() {
    const {match} = this.props;
    return (
      <Switch>
        <Route
          path={`${match.path}/account`}
          component={AccountRouter}
        />
        <Route
          exact path={`${match.path}`}
          render={() => <Redirect to={`${match.path}/account`} />}
        />
        <Route
          component={FourZeroFour}
        />
      </Switch>
    );
  }
}



const DashboardMenu = () => (
  <nav className="dashboard-footer">
    <FullscreenBtn componentId="dashboard" />
  </nav>
);


export const DashboardWrapper = (props) => (
  <LayoutWrapper id="dashboard" className="dashboard-wrapper">
    <div className="dashboard-vizzes">
      {props.children}
    </div>
    <DashboardMenu/>
  </LayoutWrapper>
);

export const DashboardContainer =  (props) => (
  <DashboardWrapper>
    <Routes {...props} />
  </DashboardWrapper>
);
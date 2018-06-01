import './dashboard.css';
import React from 'react';
import {injectIntl} from 'react-intl';
import {withNavigation} from "../navigation/withNavigation";
import {withRouter} from 'react-router';


import {Route, Switch} from 'react-router-dom';


import {Flex} from 'reflexbox';
import {cloneChildrenWithProps, findByProps} from "../helpers/reactHelpers";


import {ModelCache, ModelCacheContext} from "../viz/modelCache";


export class DashboardView extends React.Component {

  componentDidMount(){
    console.log(`Dashboard ${this.props.dashboard} mounted`);
  }

  componentWillUnmount(){
    console.log(`Dashboard ${this.props.dashboard} unmounted`);
  }

  render() {
    const {children, itemSelected, match, ...rest} = this.props;
    if (itemSelected != null && itemSelected) {
      const selectedChildren = findByProps(children, 'name', match.params.selected);
      return (
          <ModelCacheContext.Provider value={new ModelCache()}>
            <DashboardRow h={"100%"}>
              {cloneChildrenWithProps(selectedChildren, {w: 1, itemSelected, match, ...rest})}
            </DashboardRow>
          </ModelCacheContext.Provider>

      )
    } else {
      return (
        <ModelCacheContext.Provider value={new ModelCache()}>
          {cloneChildrenWithProps(children, {itemSelected, match, ...rest})}
        </ModelCacheContext.Provider>
      );
    }
  }

}

//export const Dashboard = DashboardView;

export const DashboardRow = ({children, h, title,  ...rest}) => (
  <React.Fragment>
    {
      title ?
        <h3 className="dashboard-row-title">
          {title}
        </h3> :
        null

    }
    <Flex auto align='center' justify='space-between' className="dashboard-row" style={{
      height: h
    }}>
      {cloneChildrenWithProps(children, {...rest})}
    </Flex>
  </React.Fragment>
);


const ItemMenu = ({itemSelected, detail, onClick}) => (
  detail ?
    <nav className="dashboard-item-menu">
      <i
        className={itemSelected ? "ion ion-arrow-shrink" : "ion ion-more"}
        title={itemSelected ? "Hide Details" : "Show Details"}
        onClick={onClick}
      />
    </nav> :
    null
);

export const DashboardItem = ({children, name, w, title, itemSelected, dashboardUrl, match,  navigate, primary, detail, ...rest}) => {

  const context = rest.navigation.current();

  return (
  <Flex column w={w} m={1} className="dashboard-item">
    {
       title ?
        <h3 className="dashboard-item-title">
          {title}
        </h3> :
        null

    }
    <ItemMenu
      {...{itemSelected, detail}}
      onClick={() => (
        itemSelected ? navigate.push(`${dashboardUrl}${context.search}`) : navigate.push(`${match.url}/${name}${context.search}`)
      )}
    />

      {
        itemSelected && detail ?
          React.createElement(detail,  rest)
          : React.createElement(primary,  rest)
      }

  </Flex>
  )
};

const withDetailRoutes = (WrappedDashboard) => {
  return ({match, ...rest}) => (
    <Switch>
      <Route
        path={`${match.path}/:selected`}
        component={(props) => (<WrappedDashboard itemSelected={true} dashboardUrl={match.url} {...{...rest, ...props}}/>)}
      />
      <Route
        component={(props) => (<WrappedDashboard itemSelected={false} dashboardUrl={match.url} {...{...rest, ...props}}/>)}
      />
    </Switch>
  );
};


export const Dashboard = withRouter(withNavigation(withDetailRoutes(injectIntl(DashboardView))));
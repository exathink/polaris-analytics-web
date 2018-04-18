import './dashboard.css';
import React from 'react';
import {withRouterConnection} from "../../routes/router";

import LayoutWrapper from '../../components/utility/layoutWrapper';

import {Route, Switch} from 'react-router-dom';
import FullscreenBtn from '../../components/buttons/FullscreenBtn';

import {Box, Flex} from 'reflexbox';
import {cloneChildrenWithProps, findByProps} from "../../helpers/reactHelpers";

const DashboardMenu = () => (
  <nav className="dashboard-footer">
    <FullscreenBtn componentId="dashboard" />
  </nav>
);


const DashboardContainer = (props) => (
  <LayoutWrapper id="dashboard" className="dashboard-wrapper">
    <div className="dashboard-vizzes">
      {props.children}
    </div>
    <DashboardMenu/>
  </LayoutWrapper>
);


export const DashboardView = ({children, itemSelected, match,  ...rest}) => {

  if (itemSelected != null && itemSelected) {
    const selectedChildren = findByProps(children, 'name', match.params.selected);
    return (
      <DashboardContainer>
          <DashboardRow h={"100%"}>
            {cloneChildrenWithProps(selectedChildren, {w: 1, itemSelected, match, ...rest})}
          </DashboardRow>
      </DashboardContainer>
    )
  } else {
    return (
      <DashboardContainer>
        {cloneChildrenWithProps(children, {itemSelected, match, ...rest})}
      </DashboardContainer>
    );
  }
};

//export const Dashboard = DashboardView;

export const DashboardRow = ({children, h,  ...rest}) => (
  <Flex auto align='center' justify='space-between' className="dashboard-row" style={{
    height: h
  }}>
    {cloneChildrenWithProps(children, {...rest})}
  </Flex>
);


const ItemMenu = (props) => (
  props.itemSelected != null?
    <nav className="dashboard-item-menu">
      <i
        className={props.itemSelected ? "ion ion-arrow-shrink" : "ion ion-more"}
        title={props.itemSelected ? "Hide Details" : "Show Details"}
        onClick={props.onClick}
      />
    </nav> :
    null
);

export const DashboardItem = ({children, name, w, title, itemSelected, dashboardUrl, match,  navigate, ...rest}) => (
  <Box w={w} m={1} className="dashboard-item">
    {
      !itemSelected ?
        <h3 className="dashboard-item-title">
          {title}
        </h3> :
        null

    }
    <ItemMenu
      itemSelected={itemSelected}
      onClick={() => (
        itemSelected ? navigate.replace(dashboardUrl) : navigate.replace(`${match.url}/${name}`)
      )}
    />
    {cloneChildrenWithProps(children, {navigate, itemSelected, match, ...rest})}
  </Box>
);

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


export const Dashboard = withRouterConnection(withDetailRoutes(DashboardView));
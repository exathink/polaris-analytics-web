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
            {cloneChildrenWithProps(selectedChildren, {w: 1, itemSelected, ...rest})}
          </DashboardRow>
      </DashboardContainer>
    )
  } else {
    return (
      <DashboardContainer>
        {cloneChildrenWithProps(children, {itemSelected, ...rest})}
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
  props.itemSelected != null && props.url != null ?
    <nav className="dashboard-item-menu">
      <i
        className={props.itemSelected ? "ion ion-arrow-shrink" : "ion ion-arrow-expand"}
        title={props.itemSelected ? "Hide Details" : "Show Details"}
        onClick={props.onClick}
      />
    </nav> :
    null
);

export const DashboardItem = ({children, name, w, itemSelected, url,  navigate, ...rest}) => (
  <Box w={w} m={1} className="dashboard-item">
    <ItemMenu
      itemSelected={itemSelected}
      url={url}
      onClick={() => (
        itemSelected ? navigate.push(`${url}`) : navigate.push(`${url}/show/${name}`)
      )}
    />
    {cloneChildrenWithProps(children, {navigate, itemSelected, ...rest})}
  </Box>
);

const withDetailRoutes = (WrappedDashboard) => {
  return ({url, ...rest}) => (
    <Switch>
      <Route
        path={`${url}/show/:selected`}
        component={(props) => (<WrappedDashboard itemSelected={true} {...{url, ...rest, ...props}}/>)}
      />
      <Route
        component={(props) => (<WrappedDashboard itemSelected={false} {...{url, ...rest, ...props}}/>)}
      />
    </Switch>
  );
};


export const Dashboard = withRouterConnection(withDetailRoutes(DashboardView));
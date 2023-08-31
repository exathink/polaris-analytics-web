import uniqueStyles from './dashboard.module.css';
import React from 'react';
import classNames from "classnames";
import {Flex} from "reflexbox";
import {cloneChildrenWithProps, findFirstDescendant} from "../../../helpers/reactHelpers";

import {Tabs} from "antd";
import {useRouteMatch} from 'react-router-dom';
import {withNavigationContext} from '../../navigation/components/withNavigationContext';
import { useDimensionQuery } from '../../../helpers/dimensionQueries';
import { Loading } from '../../../components/graphql/loading';
import { logGraphQlError } from '../../../components/graphql/utils';
import { DimensionContext } from '../../../helpers/hooksUtil';

const {TabPane} = Tabs;

export const DashboardLayout =  withNavigationContext(({children, itemSelected, dashboardVideoConfig, setActiveDashboardVideoConfig, className="", fullScreen,  ...rest}) => {
    React.useEffect(() => {
      setActiveDashboardVideoConfig(dashboardVideoConfig);
      // eslint-disable-next-line
    }, []);

    const match = useRouteMatch();
    const [[dimension, dimension_value], [dimension_key, dimension_key_value]] = Object.entries(match.params);

    const {loading, error, data} = useDimensionQuery({dimension, key: dimension_key_value});
    if (loading) {
      return <Loading />
    }
    if (error) {
      logGraphQlError(`${dimension}_query`, error);
      return null;
    }

    if (itemSelected != null && itemSelected) {
      const selectedChildren = [findFirstDescendant(children, 'name', match.params.selected)];
      return (
        <DimensionContext.Provider value={data}>
          <div className={uniqueStyles["dashboard"]}>
            <DashboardRow h={"98%"}>
              {cloneChildrenWithProps(selectedChildren, {w: 1, itemSelected, match, ...rest})}
            </DashboardRow>
          </div>
        </DimensionContext.Provider>
      );
    } else {
      const keyProp = rest.gridLayout ? {key: fullScreen} : {};
      return (
        <DimensionContext.Provider value={data}>
          <div className={classNames(uniqueStyles["dashboard"], className)} {...keyProp}>
            {cloneChildrenWithProps(children, {itemSelected, match, ...rest})}
          </div>
        </DimensionContext.Provider>
      );
    }
});

export const DashboardRow = ({children, h, title, subTitle, controls, align, className = "", gridLayout, ...rest}) => {
  function getDashboardRow() {
    if (gridLayout) {
      return cloneChildrenWithProps(children, {gridLayout: gridLayout, ...rest});
    } else {
      return (
        <Flex
          auto
          align={align || "center"}
          className={uniqueStyles["dashboard-row"]}
          style={{
            height: h,
          }}
        >
          {cloneChildrenWithProps(children, {...rest})}
        </Flex>
      );
    }
  }

  function getTitle() {
    if (title) {
      return (
        <nav className={uniqueStyles["menu"]} style={gridLayout ? {} : {width: "30%"}}>
          <h3 className={gridLayout ? uniqueStyles["dashboard-row-title-new"]: uniqueStyles["dashboard-row-title"]}>{title}</h3>
          {subTitle && <h4 className={uniqueStyles["dashboard-row-subtitle"]}>{subTitle}</h4>}
        </nav>
      );
    } else {
      return null;
    }
  }

  function getControls() {
    if (controls) {
      return (
        <nav
          className={uniqueStyles["menu"] + " " + uniqueStyles["title-control-container"]}
          style={gridLayout ? {} : {width: "70%", paddingRight: "75px"}}
        >
          <React.Fragment>
            {
              // Adding reverse here because we would like to the controls to laid
              // out left to right in the same order that they appear in the array
              [...controls].reverse().map((control, index) => (
                <div key={index} className={uniqueStyles["title-control"]}>
                  {React.createElement(control)}
                </div>
              ))
            }
          </React.Fragment>
        </nav>
      );
    } else {
      return null;
    }
  }

  return (
    <React.Fragment>
      {title || controls ? (
        <div className={classNames(uniqueStyles["dashboard-row-title-container"], className)}>
          {getTitle()}
          {getControls()}
        </div>
      ) : null}
      {getDashboardRow()}
    </React.Fragment>
  );
};


export const DashboardTabs = ({children, ...rest}) => (
  <Tabs className={uniqueStyles['dashboard-tabs']} animated={false} {...rest} >
    {
      children
    }
  </Tabs>
)

export const DashboardTabPane = ({children, ...rest}) => (
  <TabPane className={uniqueStyles['dashboard-tab-pane']} {...rest}>
    {
      children
    }
  </TabPane>
)




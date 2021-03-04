import uniqueStyles from './dashboard.module.css';
import React from 'react';

import {Flex} from 'reflexbox';
import {cloneChildrenWithProps, findFirstDescendant} from "../../../helpers/reactHelpers";

import {Tabs} from "antd";
import {useRouteMatch} from 'react-router-dom';
import {withNavigationContext} from '../../navigation/components/withNavigationContext';

const {TabPane} = Tabs;

export const DashboardLayout =  withNavigationContext(({children, itemSelected, dashboardVideoConfig, setActiveDashboardVideoConfig, ...rest}) => {
    React.useEffect(() => {
      setActiveDashboardVideoConfig(dashboardVideoConfig);
      // eslint-disable-next-line
    }, []);

    const match = useRouteMatch();
    if (itemSelected != null && itemSelected) {
      const selectedChildren = [findFirstDescendant(children, 'name', match.params.selected)];
      return (
        <div className={uniqueStyles["dashboard"]}>
          <DashboardRow h={"98%"}>
            {cloneChildrenWithProps(selectedChildren, {w: 1, itemSelected, match, ...rest})}
          </DashboardRow>
        </div>

      )
    } else {
      return (
        <div className={uniqueStyles["dashboard"]}>
          {cloneChildrenWithProps(children, {itemSelected, match, ...rest})}
        </div>
      );
    }
});

export const DashboardRow = ({children, h, title, subTitle, controls, align, ...rest}) => (
  <React.Fragment>
    {
      title || controls ?
        <div className={uniqueStyles["dashboard-row-title-container"]}>
          {
            title ?
              <nav className={uniqueStyles['menu']} style={{width: '30%'}}>
                <h3 className={uniqueStyles["dashboard-row-title"]}>
                  {title}
                </h3>
                {
                  subTitle &&
                    <h4 className={uniqueStyles["dashboard-row-subtitle"]}>
                      {subTitle}
                    </h4>
                }
              </nav>
              :
              null
          }
          {
            controls ?
              <nav className={uniqueStyles['menu'] + " " + uniqueStyles["title-control-container"]} style={{width: '70%', paddingRight: '75px'}}>
                <React.Fragment>
                  {
                    // Adding reverse here because we would like to the controls to laid
                    // out left to right in the same order that they appear in the array
                    controls.reverse().map(
                      (control, index) =>
                        <div key={index} className={uniqueStyles['title-control']}>
                          {React.createElement(control)}
                        </div>
                    )
                  }
                </React.Fragment>

              </nav>
              :
              null
          }
        </div>
        :
        null
    }
    <Flex auto align={align || 'center'}  className={uniqueStyles["dashboard-row"]} style={{
      height: h
    }}>
      {cloneChildrenWithProps(children, {...rest})}
    </Flex>
  </React.Fragment>
);


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




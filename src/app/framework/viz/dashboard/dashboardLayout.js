import './dashboard.css';
import React from 'react';

import {Flex} from 'reflexbox';
import {cloneChildrenWithProps, findFirstDescendant} from "../../../helpers/reactHelpers";

import {Tabs} from "antd";

const {TabPane} = Tabs;

export class DashboardLayout extends React.Component {
  render() {
    const {children, itemSelected, match, ...rest} = this.props;
    if (itemSelected != null && itemSelected) {
      const selectedChildren = [findFirstDescendant(children, 'name', match.params.selected)];
      return (
        <div className={"dashboard"}>
          <DashboardRow h={"98%"}>
            {cloneChildrenWithProps(selectedChildren, {w: 1, itemSelected, match, ...rest})}
          </DashboardRow>
        </div>

      )
    } else {
      return (
        <div className={"dashboard"}>
          {cloneChildrenWithProps(children, {itemSelected, match, ...rest})}
        </div>
      );
    }
  }

}

export const DashboardRow = ({children, h, title, controls, align, ...rest}) => (
  <React.Fragment>
    {
      title || controls ?
        <div className={"dashboard-row-title-container"}>
          {
            title ?
              <nav className={'menu'} style={{width: '30%'}}>
                <h3 className="dashboard-row-title">
                  {title}
                </h3>
              </nav>
              :
              null
          }
          {
            controls ?
              <nav className={'menu title-control-container'} style={{width: '70%'}}>
                <React.Fragment>
                  {
                    // Adding reverse here because we would like to the controls to laid
                    // out left to right in the same order that they appear in the array
                    controls.reverse().map(
                      (control, index) =>
                        <div key={index} className={'title-control'}>
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
    <Flex auto align={align || 'center'}  className="dashboard-row" style={{
      height: h
    }}>
      {cloneChildrenWithProps(children, {...rest})}
    </Flex>
  </React.Fragment>
);


export const DashboardTabs = ({children, ...rest}) => (
  <Tabs className={'dashboard-tabs'} {...rest} >
    {
      children
    }
  </Tabs>
)

export const DashboardTabPane = ({children, ...rest}) => (
  <TabPane className={'dashboard-tab-pane'} {...rest}>
    {
      children
    }
  </TabPane>
)




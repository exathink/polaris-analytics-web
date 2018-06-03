import './dashboard.css';
import React from 'react';


import {Flex} from 'reflexbox';
import {cloneChildrenWithProps, findByProps} from "../../../helpers/reactHelpers";


import {ModelCache, ModelCacheContext} from "../model/modelCache";


export class DashboardLayout extends React.Component {
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










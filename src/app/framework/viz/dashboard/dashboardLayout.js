import './dashboard.css';
import React from 'react';


import {Flex} from 'reflexbox';
import {cloneChildrenWithProps, findByProps} from "../../../helpers/reactHelpers";


import {ModelCache, ModelCacheContext} from "../model/modelCache";


export class DashboardLayout extends React.Component {

  componentDidMount() {
    if(this.props.onDashboardMounted) {
      this.props.onDashboardMounted()
    }
  }

  render() {
    const {children, itemSelected, match, ...rest} = this.props;
    if (itemSelected != null && itemSelected) {
      const selectedChildren = findByProps(children, 'name', match.params.selected);
      return (
          <ModelCacheContext.Provider value={new ModelCache()}>
            <div className={"dashboard"}>
              <DashboardRow h={"100%"}>
                {cloneChildrenWithProps(selectedChildren, {w: 1, itemSelected, match, ...rest})}
              </DashboardRow>
            </div>
          </ModelCacheContext.Provider>



      )
    } else {
      return (
        <ModelCacheContext.Provider value={new ModelCache()}>
          <div className={"dashboard"}>
          {cloneChildrenWithProps(children, {itemSelected, match, ...rest})}
          </div>
        </ModelCacheContext.Provider>
      );
    }
  }

}

export const DashboardRow = ({children, h, title, align, ...rest}) => (
  <React.Fragment>
    {
      title ?
        <h3 className="dashboard-row-title">
          {title}
        </h3> :
        null

    }
    <Flex auto align={align || 'center'} justify='space-between' className="dashboard-row" style={{
      height: h
    }}>
      {cloneChildrenWithProps(children, {...rest})}
    </Flex>
  </React.Fragment>
);










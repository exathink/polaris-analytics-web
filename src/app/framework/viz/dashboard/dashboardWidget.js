import React from "react";
import {Flex} from 'reflexbox';
import {withNavigationContext} from "../../navigation/components/withNavigationContext";
import {withRouter} from 'react-router';

const WidgetMenu = ({itemSelected, showDetail, onClick}) => (
  showDetail ?
    <nav className="dashboard-item-menu">
      <i
        className={itemSelected ? "ion ion-arrow-shrink" : "ion ion-more"}
        title={itemSelected ? "Hide Details" : "Show Details"}
        onClick={onClick}
      />
    </nav> :
    null
);

export const DashboardWidget = withRouter(withNavigationContext(
  ({children, name, w, title, subtitle, controls, itemSelected, dashboardUrl, match, context, navigate, render, showDetail, ...rest}) => {
  return (
    <Flex column w={w} m={1} className="dashboard-item">
      {
        title || subtitle || controls ?
        <div className={"dashboard-item-title-container"}>
          {
            title ?
              <h3 className="dashboard-item-title">
                {title}
              </h3>
              :
              null
          }
          {
            subtitle ?
              <h5 className="dashboard-item-subtitle">
                {subtitle}
              </h5>
              :
              null
          }
          {
            controls ?
              <nav className={'menu title-control-container'} >
                <React.Fragment>
                  {
                    controls.reverse().map(
                      (control, index)  =>
                        <div key={index} className={'title-control'}>
                          {
                            itemSelected && showDetail ?
                              React.createElement(control, {...{view: 'detail'}, ...rest})
                              :
                              React.createElement(control, {...{view: 'primary'}, ...rest})
                          }
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
      <WidgetMenu
        {...{itemSelected, showDetail}}
        onClick={() => (
          itemSelected ? navigate.push(`${dashboardUrl}${context.search}`) : navigate.push(`${match.url}/${name}${context.search}`)
        )}
      />
      {
        itemSelected && showDetail ?
          React.createElement(render, {...{view: 'detail'},  ...rest})
          : React.createElement(render, {...{view: 'primary'}, ...rest})
      }

    </Flex>
  )
}));
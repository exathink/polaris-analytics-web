import React from "react";
import {Flex} from 'reflexbox';
import {withNavigationContext} from "../../navigation/components/withNavigationContext";

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


export const DashboardWidget = withNavigationContext(
  ({children, name, w, title, controls, itemSelected, dashboardUrl, match, context, navigate, render, showDetail, ...rest}) => {
  return (
    <Flex column w={w} m={1} className="dashboard-item">
      {
        title || controls ?
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
            controls ?
              <nav className={'menu title-control-container'} >
                <React.Fragment>
                  {
                    controls.reverse().map(
                      control =>
                        <div className={'title-control'}>
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
});
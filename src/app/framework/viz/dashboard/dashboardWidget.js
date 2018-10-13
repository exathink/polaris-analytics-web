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
  ({children, name, w, title, itemSelected, dashboardUrl, match, context, navigate, render, showDetail, ...rest}) => {
  return (
    <Flex column w={w} m={1} className="dashboard-item">
      {
        title ?
          <h3 className="dashboard-item-title">
            {title}
          </h3> :
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
import React from "react";
import {Flex} from 'reflexbox'

const WidgetMenu = ({itemSelected, detail, onClick}) => (
  detail ?
    <nav className="dashboard-item-menu">
      <i
        className={itemSelected ? "ion ion-arrow-shrink" : "ion ion-more"}
        title={itemSelected ? "Hide Details" : "Show Details"}
        onClick={onClick}
      />
    </nav> :
    null
);
export const DashboardWidget = ({children, name, w, title, itemSelected, dashboardUrl, match, navigate, primary, detail, ...rest}) => {

  const context = rest.navigation.current();

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
        {...{itemSelected, detail}}
        onClick={() => (
          itemSelected ? navigate.push(`${dashboardUrl}${context.search}`) : navigate.push(`${match.url}/${name}${context.search}`)
        )}
      />

      {
        itemSelected && detail ?
          React.createElement(detail, rest)
          : React.createElement(primary, rest)
      }

    </Flex>
  )
};
/*
 * Copyright (c) Exathink, LLC  2016-2023.
 * All rights reserved
 *
 */

import Menu from "../../../components/uielements/menu";
import { Link } from "react-router-dom";
import classNames from "classnames";
import React from "react";

export function mapRoutesToMenuItems(activeTopicRoutes, currentContext, submenuColor, mode) {
  function mapRouteAsMenuGroup(route) {
    return (
      // We are simply inserting an empty menu group here
      // Similar to a divider
      <>
        {route.divider && <Menu.Divider />}
        <Menu.ItemGroup title={route.group} key={`${route.group}`} />
      </>
    );
  }

  function mapTopLevelRoute(route) {
    const TopicIcon = route.topic.Icon;
    return (
      <Menu.Item className="ant-menu-item" key={`${route.match}`} data-testid={route.match}>
        <Link
          to={(location) => {
            return {
              ...location,
              pathname: `${currentContext.urlFor(route)}`
            };
          }}
        >
            <span className="isoMenuHolder" style={submenuColor}>
              {
                route.topic.Icon ?
                  <TopicIcon style={{ marginRight: "0px" }} />
                  :
                  <i className={route.topic.icon} />
              }
              <span
                className={classNames("nav-text", mode === "vertical" ? "tw-ml-1" : "")}>{route.topic.display()}</span>
            </span>
        </Link>
      </Menu.Item>
    );
  }

  return activeTopicRoutes.map((route) => {
    return route.group != null ? mapRouteAsMenuGroup(route) : mapTopLevelRoute(route);
  });
}
import React, {Component} from "react";
import {connect} from "react-redux";
import clone from "clone";
import {Link, withRouter} from "react-router-dom";
import {Layout} from "antd";
import Menu from "../../../components/uielements/menu";
import SidebarWrapper from "./sidebar.style";

import appActions from "../../../redux/app/actions";
import {getCurrentTheme} from "../../themes/config";
import {themeConfig} from "../../../config";
import {withNavigationContext} from "../../framework/navigation/components/withNavigationContext";
import {withViewerContext} from "../../framework/viewer/viewerContext";
import classNames from "classnames";

const {Sider} = Layout;

const {toggleOpenDrawer, changeOpenKeys, changeCurrent, toggleCollapsed} = appActions;

class SidebarSubnav extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e) {
    this.props.changeCurrent([e.key]);
    if (this.props.app.view === "MobileView") {
      setTimeout(() => {
        this.props.toggleCollapsed();
        this.props.toggleOpenDrawer();
      }, 100);
    }
  }

  getAncestorKeys = (key) => {
    const map = {
      sub3: ["sub2"],
    };
    return map[key] || [];
  };

  render() {
    const {app} = this.props;
    const customizedTheme = getCurrentTheme("sidebarTheme", themeConfig.theme);
    const collapsed = clone(app.collapsed) && !clone(app.openDrawer);
    const mode = collapsed === true ? "vertical" : "inline";

    const submenuColor = {
      color: mode === "inline" ? customizedTheme.textColor : "white",
    };

    const currentContext = this.props.context;

    const subNavRoutes = currentContext.subNavRoutes();

    const selectedSubNavParent = currentContext.selectedSubNavParent();

    const subnavSelectedKeys = currentContext.selectedSubNavKeys();
    const menuProps = {
      onClick: this.handleClick,
      theme: "dark",
      mode: mode,
      selectedKeys: currentContext ? [`${currentContext.match()}`, ...subnavSelectedKeys] : [""],
      className: "isoDashboardMenu",
    };
    return (
      <SidebarWrapper className={this.props.className}>
        {subNavRoutes.length > 0 && (
          <Sider
            trigger={null}
            collapsible={true}
            collapsed={collapsed}
            width="130"
            className="isomorphicSidebar tw-shadow-md"
            style={{height: "100%", backgroundColor: "#f2f2f8", borderRight: "1px solid #2d344610"}}
          >
            <Menu key={`subnav`} {...menuProps}>
              {currentContext
                ? subNavRoutes.map((route) => (
                    <Menu.Item
                      className="ant-menu-item"
                      key={`${currentContext.urlFor(selectedSubNavParent)}/${route.match}`}
                    >
                      <Link to={`${currentContext.urlFor(selectedSubNavParent)}/${route.match}`}>
                        <span className="isoMenuHolder" style={submenuColor}>
                          <i className={classNames(route.topic.icon, "!tw-text-black")} />
                          <span className={classNames("nav-text !tw-text-black", mode === "vertical" ? "tw-ml-1" : "")}>
                            {route.topic.display()}
                          </span>
                        </span>
                      </Link>
                    </Menu.Item>
                  ))
                : null}
            </Menu>
          </Sider>
        )}
      </SidebarWrapper>
    );
  }
}

export default withRouter(
  withViewerContext(
    withNavigationContext(
      connect(
        (state) => ({
          app: state.App.toJS(),
        }),
        {toggleOpenDrawer, changeOpenKeys, changeCurrent, toggleCollapsed}
      )(SidebarSubnav)
    )
  )
);

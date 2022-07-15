import React, {Component} from 'react';
import {connect} from 'react-redux';
import clone from 'clone';
import {Link, withRouter} from 'react-router-dom';
import {Layout} from 'antd';
import {Scrollbars} from 'react-custom-scrollbars';
import Menu from '../../../components/uielements/menu';
import SidebarWrapper from './sidebar.style';


import appActions from '../../../redux/app/actions';
import Logo from './logo';
import {rtl} from '../../../config/withDirection';
import {getCurrentTheme} from '../../themes/config';
import {themeConfig} from '../../../config';
import {withNavigationContext} from "../../framework/navigation/components/withNavigationContext";
import {withViewerContext} from "../../framework/viewer/viewerContext";
import Library from "../../dashboards/library/context"
import {VIDEO_GUIDANCE} from "../../../config/featureFlags";

const {Sider} = Layout;

const {
  toggleOpenDrawer,
  changeOpenKeys,
  changeCurrent,
  toggleCollapsed,
} = appActions;

class Sidebar extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.onOpenChange = this.onOpenChange.bind(this);
  }

  handleClick(e) {
    this.props.changeCurrent([e.key]);
    if (this.props.app.view === 'MobileView') {
      setTimeout(() => {
        this.props.toggleCollapsed();
        this.props.toggleOpenDrawer();
      }, 100);
    }
  }

  onOpenChange(newOpenKeys) {
    const {app, changeOpenKeys} = this.props;
    const latestOpenKey = newOpenKeys.find(
      key => !(app.openKeys.indexOf(key) > -1)
    );
    const latestCloseKey = app.openKeys.find(
      key => !(newOpenKeys.indexOf(key) > -1)
    );
    let nextOpenKeys = [];
    if (latestOpenKey) {
      nextOpenKeys = this.getAncestorKeys(latestOpenKey).concat(latestOpenKey);
    }
    if (latestCloseKey) {
      nextOpenKeys = this.getAncestorKeys(latestCloseKey);
    }
    changeOpenKeys(nextOpenKeys);
  }

  getAncestorKeys = key => {
    const map = {
      sub3: ['sub2'],
    };
    return map[key] || [];
  };

  renderView({style, ...props}) {
    const viewStyle = {
      marginRight: rtl === 'rtl' ? '0' : '-17px',
      paddingRight: rtl === 'rtl' ? '0' : '9px',
      marginLeft: rtl === 'rtl' ? '-17px' : '0',
      paddingLeft: rtl === 'rtl' ? '9px' : '0',
    };
    return (
      <div className="box" style={{...style, ...viewStyle}} {...props} />
    );
  }

  render() {
    const {app, viewerContext} = this.props;
    const customizedTheme = getCurrentTheme('sidebarTheme', themeConfig.theme);
    const collapsed = clone(app.collapsed) && !clone(app.openDrawer);
    const mode = collapsed === true ? 'vertical' : 'inline';

    const scrollheight = app.height;
    const styling = {
      backgroundColor: customizedTheme.backgroundColor,
    };

    const submenuColor = {
      color: customizedTheme.textColor
    };

    const currentContext = this.props.context;
    const optionalTopics = this.props.optionalTopics || [];

    const topicRoutes = currentContext.routes().filter(
      route => route.topic
    )

    const subNavRoutesParent = topicRoutes.filter(route => {
      return route.topic.routes.some(x => x.subnav)
    })
    const _selectedParent = subNavRoutesParent.find(route => route.match === currentContext.selectedRoute.match);
    const subNavRoutes = (_selectedParent?.topic?.routes ?? []).filter((route) => route.subnav);

    const visibleRoutes = topicRoutes.filter(
      route =>
        (route.allowedRoles == null || viewerContext.hasSystemRoles(route.allowedRoles)) &&
        (route.requiredFeatures == null || route.requiredFeatures.every(viewerContext.isFeatureFlagActive))
    )
    const activeTopicRoutes = [
      ...visibleRoutes.filter(route => !route.topic.optional),
      ...visibleRoutes.filter(route => optionalTopics.find(topic => route.topic.name === topic))
    ];

    const a = currentContext.targetUrl.split("/");
    const subnavSelectedKeys = _selectedParent && subNavRoutes.length>0 ? [`${currentContext.urlFor(_selectedParent)}/${a[a.length-1]}`]: [];

    const menuProps = {
      onClick: this.handleClick,
      theme: 'dark',
      mode: mode,
      // openKeys: collapsed ? [] : [...app.openKeys, 'current-context'],
      selectedKeys: currentContext ? [`${currentContext.match()}`, ...subnavSelectedKeys] : [''],
      // onOpenChange: this.onOpenChange,
      className: "isoDashboardMenu"
    };
    return (
      <React.Fragment>
        <SidebarWrapper>
          <Sider
            trigger={null}
            collapsible={true}
            collapsed={collapsed}
            width="200"
            className="isomorphicSidebar"
            style={styling}
          >
            <Logo collapsed={collapsed} />
            <Scrollbars renderView={this.renderView} style={{height: scrollheight - 70}}>
              <Menu key={`top`} {...menuProps}>
                {currentContext
                  ? activeTopicRoutes.map((route) => (
                      <Menu.Item className="ant-menu-item" key={`${route.match}`}>
                        <Link to={`${currentContext.urlFor(route)}`}>
                          <span className="isoMenuHolder" style={submenuColor}>
                            <i className={route.topic.icon} />
                            <span className="nav-text">{route.topic.display()}</span>
                          </span>
                        </Link>
                      </Menu.Item>
                    ))
                  : null}
              </Menu>

              {viewerContext.isFeatureFlagActive(VIDEO_GUIDANCE) && (
                <Menu key={`bottom`} {...menuProps} style={{position: "absolute", bottom: "100px", left: "0"}}>
                  {/* Divider */}
                  <div style={{height: "1px", backgroundColor: "rgba(255, 255, 255, 0.65)"}}></div>
                  <Menu.Item className="ant-menu-item">
                    <Link to={Library.url_for}>
                      <span className="isoMenuHolder" style={submenuColor}>
                        <i className={Library.icon} />
                        <span className="tw-text-white">Content Library</span>
                      </span>
                    </Link>
                  </Menu.Item>
                </Menu>
              )}
            </Scrollbars>
          </Sider>
        </SidebarWrapper>

        <SidebarWrapper>
          {subNavRoutes.length > 0 && (
            <React.Fragment>
              <div className="tw-mt-14 tw-h-[18px] tw-bg-[#2d3446]"></div>
              <Sider
                trigger={null}
                collapsible={true}
                collapsed={collapsed}
                width="100"
                className="isomorphicSidebar"
                style={{height: "90%", backgroundColor: "rgb(209 213 219 / 1"}}
              >
                <Menu key={`subnav`} {...menuProps}>
                  {currentContext
                    ? subNavRoutes.map((route) => (
                        <Menu.Item
                          className="ant-menu-item"
                          key={`${currentContext.urlFor(_selectedParent)}/${route.match}`}
                        >
                          <Link to={`${currentContext.urlFor(_selectedParent)}/${route.match}`}>
                            <span className="isoMenuHolder" style={submenuColor}>
                              <i className={route.icon} />
                              <span className="nav-text">{route.display()}</span>
                            </span>
                          </Link>
                        </Menu.Item>
                      ))
                    : null}
                </Menu>
              </Sider>
            </React.Fragment>
          )}
        </SidebarWrapper>
      </React.Fragment>
    );
  }
}


export default withRouter(withViewerContext(withNavigationContext(connect(
  state => ({
    app: state.App.toJS(),
  }),
  {toggleOpenDrawer, changeOpenKeys, changeCurrent, toggleCollapsed}
)(Sidebar))));
